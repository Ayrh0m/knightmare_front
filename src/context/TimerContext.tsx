"use client";
import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";

type TimerState = {
  white: number;
  black: number;
};

type TimerContextType = {
  timers: TimerState;
  active: "w" | "b" | null;
  isRunning: boolean;
  start: (color: "w" | "b") => void;
  pause: () => void;
  switchTurn: (increment?: number) => void;
  reset: (initial: number) => void;
  formatTime: (ms: number) => string;
  addTime: (color: "w" | "b", ms: number) => void;
};

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({
  children,
  initialValue = 5 * 60 * 1000,
}: {
  children: React.ReactNode;
  initialValue?: number;
}) {
  const [timers, setTimers] = useState<TimerState>({
    white: initialValue,
    black: initialValue,
  });
  const [active, setActive] = useState<"w" | "b" | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const activeColorRef = useRef<"w" | "b" | null>(null);
  const isRunningRef = useRef<boolean>(false);
  const isInitializedRef = useRef<boolean>(false);

  const updateTimer = useCallback(() => {
    if (!startTimeRef.current || !activeColorRef.current || !isRunningRef.current) return;

    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    startTimeRef.current = now;

    setTimers((prev) => {
      const newTimers = { ...prev };
      const currentColor = activeColorRef.current;
      
      if (currentColor === "w") {
        const newTime = Math.max(0, prev.white - elapsed);
        newTimers.white = newTime;
        if (newTime === 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          requestAnimationFrame(() => {
            setIsRunning(false);
            isRunningRef.current = false;
            setActive(null);
            activeColorRef.current = null;
            startTimeRef.current = null;
          });
        }
      } else if (currentColor === "b") {
        const newTime = Math.max(0, prev.black - elapsed);
        newTimers.black = newTime;
        if (newTime === 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          requestAnimationFrame(() => {
            setIsRunning(false);
            isRunningRef.current = false;
            setActive(null);
            activeColorRef.current = null;
            startTimeRef.current = null;
          });
        }
      }
      return newTimers;
    });
  }, []);

  const start = useCallback((color: "w" | "b") => {
    if (isRunningRef.current && activeColorRef.current === color) return;

    if (isRunningRef.current && startTimeRef.current && activeColorRef.current) {
      updateTimer();
    }

    setActive(color);
    activeColorRef.current = color;
    setIsRunning(true);
    isRunningRef.current = true;
    startTimeRef.current = Date.now();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      updateTimer();
    }, 100);
  }, [updateTimer]);

  const pause = useCallback(() => {
    if (isRunningRef.current && startTimeRef.current && activeColorRef.current) {
      updateTimer();
    }
    setIsRunning(false);
    isRunningRef.current = false;
    setActive(null);
    activeColorRef.current = null;
    startTimeRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [updateTimer]);

  const switchTurn = useCallback((increment: number = 0) => {
    const currentColor = activeColorRef.current;
    
    if (isRunningRef.current && startTimeRef.current && currentColor) {
      updateTimer();
    }

    const nextColor = currentColor === "w" ? "b" : "w";
    
    if (currentColor && increment > 0) {
      setTimers((prev) => ({
        ...prev,
        [currentColor === "w" ? "white" : "black"]:
          prev[currentColor === "w" ? "white" : "black"] +
          increment * 1000,
      }));
    }

    start(nextColor);
  }, [updateTimer, start]);

  const reset = useCallback((initial: number) => {
    pause();
    setTimers({ white: initial, black: initial });
  }, [pause]);

  const addTime = useCallback((color: "w" | "b", ms: number) => {
    setTimers((prev) => ({
      ...prev,
      [color === "w" ? "white" : "black"]: prev[color === "w" ? "white" : "black"] + ms,
    }));
  }, []);

  function formatTime(ms: number): string {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  useEffect(() => {
    if ((!isInitializedRef.current || !isRunningRef.current) && initialValue > 0) {
      setTimers({ white: initialValue, black: initialValue });
      isInitializedRef.current = true;
    }
  }, [initialValue]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <TimerContext.Provider
      value={{
        timers,
        active,
        isRunning,
        start,
        pause,
        switchTurn,
        reset,
        formatTime,
        addTime,
      }}
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
