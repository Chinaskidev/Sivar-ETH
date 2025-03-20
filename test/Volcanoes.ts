import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
// En Ethers v6, parseEther está a nivel superior
import { ethers, parseEther } from "ethers";
import hre from "hardhat";

describe("Volcanoes", function () {
  async function deployVolcanoesFixture() {
    // getSigners() en Hardhat v3 retorna objetos Ethers v6
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Volcanoes = await hre.ethers.getContractFactory("Volcanoes");
    const baseURI =
      "https://crimson-solid-scorpion-893.mypinata.cloud/ipfs/bafybeifcnpreuj2h4z3hbmweuzwx7gy45ntvren2uubdmkz56ysy5djiz4/";

    // Desplegamos el contrato (Ethers v6)
    const volcanoes = await Volcanoes.deploy(baseURI);
    await volcanoes.waitForDeployment(); // Reemplaza a .deployed() de Ethers v5

    return { volcanoes, owner, otherAccount, baseURI };
  }

  describe("Deployment", function () {
    it("Debería desplegarse con la baseURI correcta", async function () {
      const { volcanoes, baseURI } = await loadFixture(deployVolcanoesFixture);

      // Comprobamos que uri(1) retorne baseURI + "1.json"
      expect(await volcanoes.uri(1)).to.equal(baseURI + "1.json");
    });
  });

  describe("Minting", function () {
    it("Debería permitir mintear pagando el precio correcto", async function () {
      const { volcanoes, otherAccount } = await loadFixture(
        deployVolcanoesFixture
      );

      const mintPrice = parseEther("0.005");

      // Mint 2 unidades del tokenId=1
      await volcanoes
        .connect(otherAccount)
        .publicMint(1, 2, "0x", { value: mintPrice * 2n });

      // Verificamos que la cuenta reciba los tokens
      const balance = await volcanoes.balanceOf(await otherAccount.getAddress(), 1);
      expect(balance).to.equal(2n);
    });

    it("Debería revertir si se envía ETH insuficiente", async function () {
      const { volcanoes, otherAccount } = await loadFixture(
        deployVolcanoesFixture
      );
      const mintPrice = parseEther("0.005");

      // Intentar mintear 1 unidad enviando menos ETH
      await expect(
        volcanoes.connect(otherAccount).publicMint(1, 1, "0x", {
          value: mintPrice - parseEther("0.001"),
        })
      ).to.be.revertedWith("ETH enviado incorrecto");
    });

    it("Debería revertir si se supera el supply máximo", async function () {
      const { volcanoes, otherAccount } = await loadFixture(
        deployVolcanoesFixture
      );
      const mintPrice = parseEther("0.005");

      // MAX_SUPPLY_PER_TOKEN = 20, así que intentar mintear 21 debería fallar
      await expect(
        volcanoes.connect(otherAccount).publicMint(1, 21, "0x", {
          value: mintPrice * 21n,
        })
      ).to.be.revertedWith("Supera el maximo supply para este token");
    });

    it("Debería revertir si el tokenId no está en [1..5]", async function () {
      const { volcanoes, otherAccount } = await loadFixture(
        deployVolcanoesFixture
      );
      const mintPrice = parseEther("0.005");

      // Intentar mintear tokenId=6, que no está permitido
      await expect(
        volcanoes.connect(otherAccount).publicMint(6, 1, "0x", {
          value: mintPrice,
        })
      ).to.be.revertedWith("El token id debe estar entre 1 y 5");
    });
  });

  describe("Withdrawals", function () {
    it("Debería permitir al owner retirar los fondos", async function () {
      const { volcanoes, owner, otherAccount } = await loadFixture(
        deployVolcanoesFixture
      );
      const mintPrice = parseEther("0.005");

      // Mint con otra cuenta para que el contrato tenga fondos
      await volcanoes.connect(otherAccount).publicMint(1, 2, "0x", {
        value: mintPrice * 2n,
      });

      // Obtenemos el balance inicial del owner
      const ownerAddress = await owner.getAddress();
      const balanceOwnerBefore = await hre.ethers.provider.getBalance(ownerAddress);

      // Retiramos desde el owner
      const tx = await volcanoes.connect(owner).withdraw();
      const receipt = await tx.wait(); // Esperamos confirmación

      // Obtenemos el balance final
      const balanceOwnerAfter = await hre.ethers.provider.getBalance(ownerAddress);

      // Validamos que al menos sea mayor (o cercano a la suma del minted).
      // El gas se descuenta, así que comparamos con un margen de error.
      const difference = balanceOwnerAfter - balanceOwnerBefore;

      // Esperamos que difference sea cercano a (0.01 ETH)
      // pero con algo de margen para el costo de gas
      expect(difference).to.be.closeTo(mintPrice * 2n, parseEther("0.001"));
    });

    it("Debería revertir si otro que no es el owner llama a withdraw", async function () {
      const { volcanoes, otherAccount } = await loadFixture(
        deployVolcanoesFixture
      );

      // En OpenZeppelin 5.x, Ownable puede usar un custom error en vez de un revert string
      // Si tu contrato usa el revert string "Ownable: caller is not the owner", esto funcionará:
      await expect(
        volcanoes.connect(otherAccount).withdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner");

      // Si tu contrato usa custom errors (p.e. revert OwnableUnauthorizedAccount(_msgSender())),
      // deberías usar:
      // .to.be.revertedWithCustomError(volcanoes, "OwnableUnauthorizedAccount")
      //   .withArgs(await otherAccount.getAddress());
    });
  });
});
