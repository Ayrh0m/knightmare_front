import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {

  return (
    <main className={styles.main}>
      <div className={styles.homeHeader}>
        <h1>
          <span>Knight</span>mare
        </h1>
        <p>Votre pire cauchemar</p>
      </div>
      <div className={styles.homeButtons}>
        <Link href={"/play"} className="btn btn-primary">
          Jouer
        </Link>
        <Link href={"/settings"} className="btn">
          Paramètres
        </Link>
      </div>
      <img src="/chess_fond.png" alt="" className={styles.chessImg} />
    </main>
  );
}
