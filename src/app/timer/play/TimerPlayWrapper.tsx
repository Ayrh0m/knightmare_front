"use client";
import { TimerProvider } from "@/context/TimerContext";
import { useTimerSettings } from "@/context/TimerSettingsContext";

export default function TimerPlayWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = useTimerSettings();
  const initialValue = settings.initialTime * 1000;
  const key = `${settings.initialTime}-${settings.increment}`;

  return (
    <TimerProvider key={key} initialValue={initialValue}>
      {children}
    </TimerProvider>
  );
}