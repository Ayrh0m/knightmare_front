"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

type TimerSettings = {
  initialTime: number;
  increment: number;
};

type TimerSettingsContextType = {
  settings: TimerSettings;
  updateSettings: (settings: TimerSettings) => void;
};

const defaultSettings: TimerSettings = {
  initialTime: 5 * 60,
  increment: 0,
};

const TimerSettingsContext = createContext<TimerSettingsContextType | null>(
  null
);

export function TimerSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("timer-settings");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse timer settings", e);
        }
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    const stored = localStorage.getItem("timer-settings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings((prev) => {
          if (prev.initialTime !== parsed.initialTime || prev.increment !== parsed.increment) {
            return parsed;
          }
          return prev;
        });
      } catch (e) {
        console.error("Failed to parse timer settings", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("timer-settings", JSON.stringify(settings));
  }, [settings]);

  function updateSettings(newSettings: TimerSettings) {
    setSettings(newSettings);
  }

  return (
    <TimerSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </TimerSettingsContext.Provider>
  );
}

export function useTimerSettings() {
  const ctx = useContext(TimerSettingsContext);
  if (!ctx)
    throw new Error(
      "useTimerSettings must be used inside TimerSettingsProvider"
    );
  return ctx;
}