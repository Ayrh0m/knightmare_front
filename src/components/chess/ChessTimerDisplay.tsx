"use client";
import { useTimer } from "@/context/TimerContext";
import { useEffect, useState } from "react";

interface ChessTimerDisplayProps {
  side: "w" | "b";
}

export default function ChessTimerDisplay({ side }: ChessTimerDisplayProps) {
  const { timers, active, formatTime } = useTimer();
  const [displayTime, setDisplayTime] = useState<number>(
    side === "w" ? timers.white : timers.black
  );

  useEffect(() => {
    setDisplayTime(side === "w" ? timers.white : timers.black);
  }, [timers, side]);

  const isActive = active === side;
  const time = side === "w" ? timers.white : timers.black;
  const isLowTime = time < 10000;

  return (
    <div
      className={`timer-display ${isActive ? "active" : ""} ${
        isLowTime ? "low-time" : ""
      }`}
    >
      <div className="timer-label">{side === "w" ? "Blancs" : "Noirs"}</div>
      <div className="timer-value">{formatTime(displayTime)}</div>
    </div>
  );
}