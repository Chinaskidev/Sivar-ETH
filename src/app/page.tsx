"use client";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MintNFT } from "../app/MintNFT"; 


export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf4eb] flex flex-col items-center py-8 px-4">
      <ConnectButton accountStatus="address" chainStatus="icon" showBalance={false} />
      <h1 className="mt-6 text-4xl md:text-5xl font-extrabold">Volcanoes on Base</h1>
      <p className="text-md md:text-lg mt-2">¡Colecciona y haz mint de tu volcán favorito!</p>

      {/* Aquí llamas a MintNFT */}
      <div className="mt-8">
        <MintNFT />
      </div>
    </div>
  );
}
