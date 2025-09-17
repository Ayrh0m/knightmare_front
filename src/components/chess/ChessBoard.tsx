"use client";

import { useGame } from "@/context/ChessContext";
import { Chess, Color, Move, Square } from "chess.js";
import { useEffect, useRef, useState } from "react";
import Piece from "./Piece";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function ChessBoard() {
  const { game, turn, makeMove, currentIndex, canPlay, fenHistory, goTo } = useGame();
  const [displayGame, setDisplayGame] = useState<Chess>(game);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);

  useEffect(() => {
    setSelectedSquare(null);
  }, [displayGame]);

  useEffect(() => {
    setDisplayGame(new Chess(fenHistory[currentIndex]))
  }, [currentIndex, fenHistory])

  useEffect(() => {
  const arrowPressed = (e: KeyboardEvent) => {
    let nav = false;
    if (e.key === "ArrowLeft") nav = goTo(currentIndex - 1);
    if (e.key === "ArrowRight") nav = goTo(currentIndex + 1);
    if (nav) setDisplayGame(new Chess(fenHistory[currentIndex]));
  };

  window.addEventListener("keydown", arrowPressed);
  return () => {
    window.removeEventListener("keydown", arrowPressed);
  };
}, [currentIndex, fenHistory, goTo]);


  function handleClick(square: Square, color: Color | undefined): Move | null {
    let move = null;
    if (!selectedSquare) {
      if (square && color === turn) selectSquare(square);
      return move;
    } else {
      if (square && color === turn) selectSquare(square);
      else if (square && canPlay) {
        move = makeMove(selectedSquare, square, undefined);
        setSelectedSquare(null);
        setLegalMoves([]);
      } else {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
      return move;
    }
  }

  function selectSquare(square: Square) {
    setSelectedSquare(square);
    const moves = displayGame.moves({ square: square, verbose: true });
    setLegalMoves(moves.map((m) => m.to));
  }

  const board = displayGame.board();

  return (
    <div className={`board ${!canPlay ? "static" : ""}`}>
      {board.map((row, i) =>
        row.map((square, j) => {
          const isLight = (i + j) % 2 === 0;
          const file = files[j];
          const rank = 8 - i;
          const squareName = `${file}${rank}`;
          return (
            <div
              key={squareName}
              className={`square ${isLight ? "light" : "dark"} ${
                square?.square === selectedSquare ? "selected" : ""
              }`}
              onClick={() => handleClick(squareName as Square, square?.color)}
            >
              {j === 0 && (
                <span className={`rank ${isLight ? "dark" : ""}`}>{rank}</span>
              )}
              {i === 7 && (
                <span className={`file ${isLight ? "dark" : ""}`}>{file}</span>
              )}
              {square && <Piece type={square.type} color={square.color} />}
              {legalMoves.includes(squareName as Square) && !square && (
                <span className="legal"></span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
