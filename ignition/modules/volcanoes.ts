// ignition/volcanoes.ts (renombra locks.ts si quieres)
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const volcanoes = buildModule("volcanoes", (m) => {
  // Definimos un parámetro para la baseURI
  const baseURI = m.getParameter(
    "baseURI",
    "https://crimson-solid-scorpion-893.mypinata.cloud/ipfs/..." 
  );

  // Instanciamos el contrato "Volcanoes" con el argumento baseURI
  const volcanoes = m.contract("Volcanoes", [baseURI]);

  return { volcanoes };
});

export default volcanoes;
