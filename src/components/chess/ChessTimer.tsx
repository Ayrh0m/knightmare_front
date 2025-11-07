"use client";
import { useEffect, useRef, useState } from "react";
import { useGame } from "@/context/ChessContext";

interface ChessTimerProps {
  initialValue: number;
  side: "w" | "b";
}

export default function ChessTimer({ initialValue, side }: ChessTimerProps) {
  const { turn } = useGame();
  const timeRef = useRef(initialValue);
  const [, forceRender] = useState(0);

  useEffect(() => {
    if (turn !== side) return;

    const interval = setInterval(() => {
      timeRef.current = Math.max(0, timeRef.current - 1000);
      forceRender((n) => n + 1);
      if (timeRef.current === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [turn, side]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return <div>{formatTime(timeRef.current)}</div>;
}