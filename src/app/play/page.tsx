"use client";
import ChessBoard from "@/components/chess/ChessBoard";
import { useGame } from "@/context/ChessContext";

export default function Play() {
    const { resetGame } = useGame();
  return (
    <div>
      <ChessBoard />
      <button onClick={resetGame}>Reset</button>
    </div>
  );
}
