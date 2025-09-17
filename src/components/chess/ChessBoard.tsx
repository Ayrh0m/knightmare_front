"use client";

import { useGame } from "@/context/ChessContext";
import { Chess, Color, Move, PieceSymbol, Square } from "chess.js";
import { useEffect, useRef, useState } from "react";
import Piece from "./Piece";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function ChessBoard() {
  const {
    game,
    turn,
    makeMove,
    currentIndex,
    canPlay,
    fenHistory,
    goTo,
    isPromotionMove,
  } = useGame();
  const [displayGame, setDisplayGame] = useState<Chess>(game);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [showPromotion, setShowPromotion] = useState<boolean>(false);
  const [promotionChoice, setPromotionChoice] = useState<PieceSymbol | null>(
    null
  );
  const [pendingMove, setPendingMove] = useState<{
    from: Square;
    to: Square;
  } | null>(null);
  const [fileStart, setFileStart] = useState<Color>(turn);

  useEffect(() => {
    setSelectedSquare(null);
  }, [displayGame]);

  useEffect(() => {
    setDisplayGame(new Chess(fenHistory[currentIndex]));
  }, [currentIndex, fenHistory]);

  useEffect(() => {
    if (!showPromotion) return;
    setFileStart(turn);
  }, [showPromotion]);

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
        const piece = game.get(selectedSquare)?.type;
        if (piece) {
          const isPromotion = isPromotionMove(selectedSquare, square, piece);
          if (isPromotion) {
            setPendingMove({ from: selectedSquare, to: square });
            setShowPromotion(true);
          } else {
            move = makeMove(selectedSquare, square, undefined);
          }
          setSelectedSquare(null);
          setLegalMoves([]);
        }
      } else {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
      return move;
    }
  }

  function handlePromotion(p: PieceSymbol) {
    if (pendingMove) {
      makeMove(pendingMove.from, pendingMove.to, p);
      setPendingMove(null);
      setShowPromotion(false);
    }
  }

  function selectSquare(square: Square) {
    setSelectedSquare(square);
    const moves = displayGame.moves({ square: square, verbose: true });
    setLegalMoves(moves.map((m) => m.to));
  }

  const board = displayGame.board();
  const promotions = ["q", "r", "b", "n"] as PieceSymbol[];

  return (
    <div className={`board ${!canPlay ? "static" : ""}`}>
      {showPromotion && (
        <div className="promotion-container">
          {promotions.map((p) => (
            <img
              key={p}
              src={`/pieces/${fileStart}_${p}.svg`}
              alt={`${p} promotion`}
              className="promotion-choice"
              onClick={() => handlePromotion(p)}
            />
          ))}
        </div>
      )}
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
