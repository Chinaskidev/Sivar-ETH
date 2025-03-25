import { ethers } from "hardhat";

async function main() {
  // Ajusta la URI base según tu preferencia
  const baseURI = "https://crimson-solid-scorpion-893.mypinata.cloud/ipfs/bafybeigdu7gjjno2urgfelapikflezytnzxn62syxjvs3lxp2q5mmlu5de/";

  // Obtenemos la factoría de tu contrato
  const VolcanoesFactory = await ethers.getContractFactory("Volcanoes");

  // Desplegamos el contrato con el constructor que recibe baseURI
  const volcanoes = await VolcanoesFactory.deploy(baseURI);

  // Esperamos confirmación del despliegue (Ethers v6)
  await volcanoes.waitForDeployment();

  // Obtenemos la dirección del contrato
  const contractAddress = await volcanoes.getAddress();
  console.log("Volcanoes desplegado en:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
