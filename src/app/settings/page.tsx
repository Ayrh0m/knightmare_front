"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function Settings() {
  const [showMoveHelp, setShowMoveHelp] = useState<string | null>(
    localStorage.getItem("show-move-help")
  );

  useEffect(() => {
    if (
      showMoveHelp === "true" &&
      localStorage.getItem("show-move-help") !== "true"
    )
      localStorage.setItem("show-move-help", "true");
    else if (
      showMoveHelp === "false" &&
      localStorage.getItem("show-move-help") !== "false"
    )
      localStorage.setItem("show-move-help", "false");
    else if (!showMoveHelp) {
      localStorage.setItem("show-move-help", "true");
      setShowMoveHelp("true");
    }
  }, [showMoveHelp]);

  return (
    <main className={styles.settingsMain}>
      <div className={styles.settingsHeader}>
        <h1>Knighmare</h1>
        <p>Réglez vos paramètres</p>
      </div>
      <div className={styles.settingsContainer}>
        <div className={styles.settingContainer}>
          <span className={styles.settingName}>
            Afficher l&apos;aide des coups légaux
          </span>
          <div className={styles.settingChoices}>
            <span
              className={`${styles.settingChoice} ${
                showMoveHelp === "true" && styles.selected
              }`}
              onClick={() => setShowMoveHelp("true")}
            >
              Oui
            </span>
            <span
              className={`${styles.settingChoice} ${
                showMoveHelp === "false" && styles.selected
              }`}
              onClick={() => setShowMoveHelp("false")}
            >
              Non
            </span>
          </div>
        </div>
      </div>
      <div className={styles.settingsButtons}>
        <Link href={"/"} className="btn">
          Revenir à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
