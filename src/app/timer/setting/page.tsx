"use client";
import { useState, useEffect } from "react";
import { useTimerSettings } from "@/context/TimerSettingsContext";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TimerSetting() {
  const { settings, updateSettings } = useTimerSettings();
  const router = useRouter();
  const [initialMinutes, setInitialMinutes] = useState<number>(
    Math.floor(settings.initialTime / 60)
  );
  const [initialSeconds, setInitialSeconds] = useState<number>(
    settings.initialTime % 60
  );
  const [incrementSeconds, setIncrementSeconds] = useState<number>(
    settings.increment
  );

  function formatTimeInput(value: number, max: number): number {
    return Math.max(0, Math.min(max, Math.floor(value)));
  }

  function handleStart() {
    const totalSeconds = initialMinutes * 60 + initialSeconds;
    updateSettings({
      initialTime: totalSeconds,
      increment: incrementSeconds,
    });
    router.push("/timer/play");
  }

  const totalInitialTime = initialMinutes * 60 + initialSeconds;

  return (
    <main className={styles.settingsMain}>
      <div className={styles.settingsHeader}>
        <h1>Knightmare</h1>
        <p>Configuration du timer</p>
      </div>
      <div className={styles.settingsContainer}>
        <div className={styles.settingContainer}>
          <span className={styles.settingName}>Temps initial</span>
          <div className={styles.timeInputs}>
            <div className={styles.timeInputGroup}>
              <label>Minutes</label>
              <input
                type="number"
                min="0"
                max="60"
                value={initialMinutes}
                onChange={(e) =>
                  setInitialMinutes(formatTimeInput(Number(e.target.value), 60))
                }
                className={styles.timeInput}
              />
            </div>
            <span className={styles.timeSeparator}>:</span>
            <div className={styles.timeInputGroup}>
              <label>Secondes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={initialSeconds}
                onChange={(e) =>
                  setInitialSeconds(formatTimeInput(Number(e.target.value), 59))
                }
                className={styles.timeInput}
              />
            </div>
          </div>
        </div>
        <div className={styles.settingContainer}>
          <span className={styles.settingName}>Incrément par coup</span>
          <div className={styles.timeInputs}>
            <div className={styles.timeInputGroup}>
              <label>Secondes</label>
              <input
                type="number"
                min="0"
                max="60"
                value={incrementSeconds}
                onChange={(e) =>
                  setIncrementSeconds(formatTimeInput(Number(e.target.value), 60))
                }
                className={styles.timeInput}
              />
            </div>
          </div>
        </div>
        {totalInitialTime === 0 && (
          <p className={styles.errorMessage}>
            Le temps initial doit être supérieur à 0
          </p>
        )}
      </div>
      <div className={styles.settingsButtons}>
        <button
          onClick={handleStart}
          className={`btn btn-primary ${totalInitialTime === 0 ? "disabled" : ""}`}
          disabled={totalInitialTime === 0}
        >
          Lancer la partie
        </button>
        <Link href={"/"} className="btn">
          Revenir à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}