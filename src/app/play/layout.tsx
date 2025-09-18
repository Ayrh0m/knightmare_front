import type { Metadata } from "next";
import "../chess.css";
import { GameProvider } from "@/context/ChessContext";

export const metadata: Metadata = {
  title: "Knightmare - Play",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <GameProvider>{children}</GameProvider>;
}
