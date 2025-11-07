"use client";

import { useEffect, useState } from "react";
import ChessBoardCore from "./ChessBoardCore";
import ChessHistory from "./ChessHistory";
import ChessReset from "./ChessReset";

export default function ChessBoard() {
  const [showMoveHelp, setShowMoveHelp] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("show-move-help");
    setShowMoveHelp(stored === "true");
  }, []);

  return (
    <>
      <div className="chess">
        <ChessBoardCore showMoveHelp={showMoveHelp} />
        <section className="right-panel">
          <ChessHistory />
          <ChessReset />
        </section>
      </div>
    </>
  );
}
