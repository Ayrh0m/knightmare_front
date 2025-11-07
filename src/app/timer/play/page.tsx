"use client";
import { useEffect, useRef } from "react";
import { useGame } from "@/context/ChessContext";
import { useTimer } from "@/context/TimerContext";
import { useTimerSettings } from "@/context/TimerSettingsContext";
import ChessBoardCore from "@/components/chess/ChessBoardCore";
import ChessHistory from "@/components/chess/ChessHistory";
import ChessReset from "@/components/chess/ChessReset";
import ChessTimerDisplay from "@/components/chess/ChessTimerDisplay";
import styles from './page.module.css';
import Link from "next/link";

export default function TimerPlay() {
  const { turn, history, declareTimeout, timeoutWinner } = useGame();
  const { start, switchTurn, reset, timers, active, pause } = useTimer();
  const { settings } = useTimerSettings();
  const previousTurnRef = useRef<"w" | "b">(turn);
  const hasStartedRef = useRef<boolean>(false);

  useEffect(() => {
    const initialTimeMs = settings.initialTime * 1000;
    reset(initialTimeMs);
    hasStartedRef.current = false;
    previousTurnRef.current = turn;
  }, [reset, settings.initialTime]);

  useEffect(() => {
    if (history.length === 0 && hasStartedRef.current) {
      const initialTimeMs = settings.initialTime * 1000;
      reset(initialTimeMs);
      hasStartedRef.current = false;
      previousTurnRef.current = turn;
    }
  }, [history.length, reset, settings.initialTime, turn]);

  useEffect(() => {
    if (history.length === 0 && turn === "w" && !active && !hasStartedRef.current && !timeoutWinner) {
      start("w");
      hasStartedRef.current = true;
      previousTurnRef.current = "w";
    }
  }, [history.length, turn, active, start, timeoutWinner]);

  useEffect(() => {
    if (hasStartedRef.current && turn !== previousTurnRef.current && !timeoutWinner) {
      switchTurn(settings.increment);
      previousTurnRef.current = turn;
    }
  }, [turn, switchTurn, settings.increment, timeoutWinner]);

  const timeoutDeclaredRef = useRef<boolean>(false);
  
  useEffect(() => {
    if (!timeoutWinner) {
      timeoutDeclaredRef.current = false;
    }
  }, [timeoutWinner]);

  useEffect(() => {
    if (!timeoutDeclaredRef.current && !timeoutWinner) {
      if (timers.white <= 0 && (active === "w" || (active === null && turn === "w" && hasStartedRef.current))) {
        timeoutDeclaredRef.current = true;
        pause();
        declareTimeout("b");
      } 
      else if (timers.black <= 0 && (active === "b" || (active === null && turn === "b" && hasStartedRef.current))) {
        timeoutDeclaredRef.current = true;
        pause();
        declareTimeout("w");
      }
    }
  }, [timers.white, timers.black, active, declareTimeout, timeoutWinner, pause, turn]);

  return (
    <main className={styles.playContainer}>
      <div className="chess">
        <div className={styles.timersSection}>
          <div className="timers-container">
            <ChessTimerDisplay side="b" />
            <ChessTimerDisplay side="w" />
          </div>
        </div>
        <ChessBoardCore />
        <section className="right-panel">
          <ChessHistory />
          <ChessReset />
        </section>
      </div>
      <Link href={'/'} className={`btn ${styles.btnHome}`}>Retour à l&apos;accueil</Link>
    </main>
  );
}