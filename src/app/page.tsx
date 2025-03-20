"use client";
import React from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import { parseEther } from "ethers";
import volcanoesABI from "../../abis/VolcanoesABI.json";

const CONTRACT_ADDRESS = "0x1b33ae1068E0ADC68ffcbfb2b8A0D30f4280f0c9";

interface Volcano {
  id: number;
  name: string;
  image: string;
  description: string;
}

const volcanoesData: Volcano[] = [
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
      <div className="flex flex-col items-center mb-8">
        <ConnectButton accountStatus="address" chainStatus="icon" showBalance={false} />
        <h1 className="mt-6 text-4xl md:text-5xl font-extrabold">Volcanoes on Base</h1>
        <p className="text-md md:text-lg mt-2">¡Colecciona y haz mint de tu volcán favorito!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
        {volcanoesData.map((volcano) => (
          <VolcanoCard key={volcano.id} volcano={volcano} />
        ))}
      </div>
    </div>
  );
}

function VolcanoCard({ volcano }: { volcano: Volcano }) {
  const {
    data: txHash,
    error,
    isPending,
    writeContract,
  } = useWriteContract();

  const { isLoading: txLoading, isSuccess: txSuccess } =
    useWaitForTransactionReceipt({ hash: txHash });

  const minting = isPending || txLoading;
  const mintedOk = txSuccess;

  function handleMint() {
    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: volcanoesABI.abi,
        functionName: "publicMint",
        args: [volcano.id, 1, "0x"],
        value: parseEther("0.005"),
      },
      {
        onError: (err) => {
          const castedError = err as BaseError;
          console.error(
            "Error al enviar tx:",
            castedError.shortMessage ?? err.message
          );
        },
        onSuccess: (data) => {
          console.log("Transacción firmada. Hash:", data);
        },
      }
    );
  }

  return (
    <div className="relative border-2 border-[#d1c1a3] bg-white rounded-lg p-4 shadow-lg flex flex-col items-center">
      <div className="w-full h-64 relative">
        <Image
          src={volcano.image}
          alt={volcano.name}
          fill
          className="object-contain"
        />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-center">{volcano.name}</h2>
      <p className="text-center text-sm mt-2">{volcano.description}</p>

      <button
        className="mt-4 px-4 py-2 bg-[#c4a484] text-white rounded-md hover:bg-[#b39276] transition-colors disabled:opacity-50"
        onClick={handleMint}
        disabled={minting}
      >
        {minting ? "Minting..." : "Mint"}
      </button>

      {error && (
        <p className="mt-2 text-red-700">
          Error: {(error as BaseError).shortMessage ?? error.message}
        </p>
      )}
      {mintedOk && <p className="mt-2 text-green-700">¡Mint exitoso!</p>}
    </div>
  );
}
