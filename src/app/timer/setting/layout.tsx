import type { Metadata } from "next";
import { TimerSettingsProvider } from "@/context/TimerSettingsContext";

export const metadata: Metadata = {
  title: "Knightmare - Timer Settings",
};

export default function TimerSettingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TimerSettingsProvider>{children}</TimerSettingsProvider>;
}

