"use client"; // Si usas Next.js 13 con el app router

import * as React from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import volcanoesABI from "../../abis/VolcanoesABI.json";
import { parseEther } from "ethers";


export function MintNFT() {
  const {
    data: hash,       
    error,
    isPending,        
    writeContract,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tokenId = formData.get("tokenId") as string;

    writeContract({
      address: "0x1b33ae1068E0ADC68ffcbfb2b8A0D30f4280f0c9", 
      abi: volcanoesABI.abi,
      functionName: "mint",    
      args: [BigInt(tokenId)],
      // Si tu función es payable y requieres ETH:
       value: parseEther("0.005"),
    });
  }

  return (
    <form onSubmit={submit}>
      <input name="tokenId" placeholder="69420" required />
      <button disabled={isPending} type="submit">
        {isPending ? "Confirming..." : "Mint"}
      </button>
      {/* Muestra el hash si existe */}
      {hash && <div>Transaction Hash: {hash}</div>}
      {/* Esperando confirmación en la red */}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {/* Tx confirmada */}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {/* Error si falla */}
      {error && <div style={{ color: "red" }}>Error: {error.message}</div>}
    </form>
  );
}
