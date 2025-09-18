"use client";
import ChessBoard from "@/components/chess/ChessBoard";
import { useGame } from "@/context/ChessContext";
import styles from './page.module.css';
import Link from "next/link";

export default function Play() {
    const { resetGame } = useGame();
  return (
    <main className={styles.playContainer}>
      <ChessBoard />
      <Link href={'/'} className={`btn ${styles.btnHome}`}>Retour à l'accueil</Link>
    </main>
  );
}
