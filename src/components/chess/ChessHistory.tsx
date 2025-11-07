"use client";
import { useGame } from "@/context/ChessContext";
import Image from "next/image";

export default function ChessHistory() {
  const { history, currentIndex, goTo } = useGame();

  return (
    <section className="history-container">
      <div className="history-header">
        <span>Blancs</span>
        <span>Noirs</span>
      </div>
      <div className="history-content">
        {Array.from({ length: Math.ceil(history.length / 2) }).map(
          (_, rowIndex) => {
            const moveNumber = rowIndex + 1;
            const whiteMove = history[rowIndex * 2];
            const blackMove = history[rowIndex * 2 + 1];

            const whitePiece =
              whiteMove && whiteMove.piece !== 'p' && `/pieces/w_${whiteMove.piece}.svg`;
            const blackPiece =
              blackMove && blackMove.piece !== 'p' && `/pieces/b_${blackMove.piece}.svg`;

            return (
              <div key={rowIndex} className="history-row">
                <span className="history-move-number">{moveNumber}.</span>
                <div
                  className={`history-move ${
                    currentIndex === rowIndex * 2 + 1 ? "current" : ""
                  }`}
                  onClick={() => goTo(rowIndex * 2 + 1)}
                >
                  {whitePiece && (
                    <img src={whitePiece} alt={`${whiteMove.san} img`} />
                  )}
                  <span>{whiteMove ? whiteMove.san : ""}</span>
                </div>
                <div
                  className={`history-move ${
                    currentIndex === rowIndex * 2 + 2 ? "current" : ""
                  }`}
                  onClick={() => goTo(rowIndex * 2 + 2)}
                >
                  {blackPiece && (
                    <img src={blackPiece} alt={`${blackMove.san} img`} />
                  )}
                  <span>{blackMove ? blackMove.san : ""}</span>
                </div>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}
