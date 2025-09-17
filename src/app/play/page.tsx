"use client";
import ChessBoard from "@/components/chess/ChessBoard";
import { useGame } from "@/context/ChessContext";
import styles from './page.module.css';

export default function Play() {
    const { resetGame } = useGame();
  return (
    <main className={styles.playContainer}>
      <ChessBoard />
      <button onClick={resetGame}>Reset</button>
    </main>
  );
}
