"use client";
import ChessBoard from "@/components/chess/ChessBoard";
import styles from './page.module.css';
import Link from "next/link";

export default function Play() {
  return (
    <main className={styles.playContainer}>
      <ChessBoard />
      <Link href={'/'} className={`btn ${styles.btnHome}`}>Retour à l&apos;accueil</Link>
    </main>
  );
}
