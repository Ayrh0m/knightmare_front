"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type TimerState = {
  white: number;
  black: number;
};

type TimerContextType = {
  timers: TimerState;
  active: "w" | "b" | null;
  start: (color: "w" | "b") => void;
  pause: () => void;
  switchTurn: () => void;
  reset: (initial: number) => void;
  formatTime: (ms: number) => string;
};

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({
  children,
  initialValue = 5 * 60 * 1000, // 5 min par défaut
}: {
  children: React.ReactNode;
  initialValue?: number;
}) {
  const [timers, setTimers] = useState<TimerState>({
    white: initialValue,
    black: initialValue,
  });
  const [active, setActive] = useState<"w" | "b" | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function start(color: "w" | "b") {
    setActive(color);
  }

  function pause() {
    setActive(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function switchTurn() {
    console.log('switch')
    setActive((prev) => (prev === "w" ? "b" : "w"));
  }

  function reset(initial: number) {
    setTimers({ white: initial, black: initial });
    setActive(null);
  }

  function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  return (
    <TimerContext.Provider
      value={{ timers, active, start, pause, switchTurn, reset, formatTime }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used inside TimerProvider");
  return ctx;
}
