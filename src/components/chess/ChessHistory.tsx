"use client";
import { useGame } from "@/context/ChessContext";

export default function ChessHistory() {
  const { history } = useGame();

  

  return (
    <section className="history-container">
      {history.map((m) => {
        console.log(m);
        return <button>{m.san}</button>;
      })}
    </section>
  );
}
