"use client";
import "../../chess.css";
import { GameProvider } from "@/context/ChessContext";
import { TimerProvider } from "@/context/TimerContext";
import { TimerSettingsProvider } from "@/context/TimerSettingsContext";
import TimerPlayWrapper from "./TimerPlayWrapper";

export default function TimerPlayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TimerSettingsProvider>
      <GameProvider>
        <TimerPlayWrapper>{children}</TimerPlayWrapper>
      </GameProvider>
    </TimerSettingsProvider>
  );
}
