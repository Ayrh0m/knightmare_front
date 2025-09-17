"use client";
import { useGame } from "@/context/ChessContext";

export default function ChessHistory() {
  const { history, currentIndex, goTo } = useGame();

  return (
    <section className="history-container">
      {history.map((m, i) => {
        return (
          <button key={i} className="history-move" onClick={() => goTo(i+1)}>
            {m.san}
          </button>
        );
      })}
    </section>
  );
}
