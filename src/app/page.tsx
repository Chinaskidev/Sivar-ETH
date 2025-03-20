"use client";
import React from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "ethers"; // Ethers v6
import volcanoesABI from "../../abis/VolcanoesABI.json";

// Dirección de tu contrato en Base Sepolia
const CONTRACT_ADDRESS = "0x1b33ae1068E0ADC68ffcbfb2b8A0D30f4280f0c9";

const volcanoesData = [
  {
    id: 1,
    name: "Volcano #1",
    image: "/san_sanl.png",
    description: "El volcán primigenio, poderoso e imponente.",
  },
  {
    id: 2,
    name: "Volcano #2",
    image: "/santa_ana.png",
    description: "Erupción incandescente en un atardecer místico.",
  },
  {
    id: 3,
    name: "Volcano #3",
    image: "/san_vicen.png",
    description: "La calma antes de la tormenta.",
  },
  {
    id: 4,
    name: "Volcano #4",
    image: "/san_mig.png",
    description: "Una furia elemental incontenible.",
  },
  {
    id: 5,
    name: "Volcano #5",
    image: "/izalco.png",
    description: "El faro de Centro America.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf4eb] text-[#4b3e2b] font-serif flex flex-col items-center py-8 px-4">
      {/* Encabezado */}
      <div className="flex flex-col items-center mb-8">
        <ConnectButton accountStatus="address" chainStatus="icon" showBalance={false} />
        <h1 className="mt-6 text-4xl md:text-5xl font-extrabold">Volcanoes on Base</h1>
        <p className="text-md md:text-lg mt-2">¡Colecciona y haz mint de tu volcán favorito!</p>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
        {volcanoesData.map((volcano) => (
          <VolcanoCard key={volcano.id} volcano={volcano} />
        ))}
      </div>
    </div>
  );
}

/**
 * Componente Card para cada volcán
 */
function VolcanoCard({
  volcano,
}: {
  volcano: { id: number; name: string; image: string; description: string };
}) {
  // useWriteContract envía la tx y nos da feedback inmediato
  const {
    data: txHash,    // hash de la transacción si se firmó
    isLoading,       // indicando si se está firmando la tx
    isSuccess,       // la tx fue firmada correctamente
    status,          // 'idle' | 'pending' | 'error' | 'success'
    error,           // objeto de error si falla
    write,
    // Podemos usar callbacks onSuccess, onError, onSettled si deseamos:
    // onSuccess, onError, onSettled, ...
  } = useWriteContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: volcanoesABI,
    functionName: "publicMint",
    args: [BigInt(volcano.id), 1n, "0x"], // Minteamos 1 unidad
    value: parseEther("0.005"),           // 0.005 ETH
    // Ejemplo de callback onSuccess:
    onSuccess(data, variables, context) {
      console.log("Transacción firmada. Hash:", data);
    },
    onError(err, variables, context) {
      console.error("Error al enviar transacción:", err);
    },
  });

  // useWaitForTransactionReceipt para saber cuándo se minó la tx
  const {
    isLoading: txLoading, // Esperando confirmación en la red
    isSuccess: txSuccess, // Ya está minada
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Estado combinado: true si se está firmando o minando
  const minting = isLoading || txLoading;

  // true cuando se firmó e hizo mining con éxito
  const mintedOk = isSuccess && txSuccess;

  return (
    <div className="relative border-2 border-[#d1c1a3] bg-white rounded-lg p-4 shadow-lg flex flex-col items-center">
      {/* Imagen */}
      <div className="w-full h-64 relative">
        <Image src={volcano.image} alt={volcano.name} fill className="object-contain" />
      </div>

      {/* Nombre y descripción */}
      <h2 className="mt-4 text-2xl font-bold text-center">{volcano.name}</h2>
      <p className="text-center text-sm mt-2">{volcano.description}</p>

      {/* Botón de Mint */}
      <button
        className="mt-4 px-4 py-2 bg-[#c4a484] text-white rounded-md hover:bg-[#b39276] transition-colors disabled:opacity-50"
        onClick={() => write?.()} // Llama a la transacción
        disabled={!write || minting} // Deshabilita si no hay write o si está minteando
      >
        {minting ? "Minting..." : "Mint"}
      </button>

      {/* Mensajes de feedback */}
      {error && (
        <p className="mt-2 text-red-700">
          Error: {error.shortMessage || error.message}
        </p>
      )}
      {mintedOk && <p className="mt-2 text-green-700">¡Mint exitoso!</p>}
    </div>
  );
}
