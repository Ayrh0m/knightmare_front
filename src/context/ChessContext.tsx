"use client";
import { createContext, useContext, useState } from "react";
import { Chess, Color, Move, PieceSymbol, Square } from "chess.js";

type GameContextType = {
  game: Chess;
  turn: "w" | "b";
  history: Move[];
  fenHistory: string[];
  currentIndex: number;
  lastIndex: number;
  canPlay: boolean;
  makeMove: (
    from: Square,
    to: Square,
    promotion: PieceSymbol | undefined
  ) => Move | null;
  resetGame: () => void;
  goTo: (index: number) => boolean;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState(new Chess());
  const [turn, setTurn] = useState<Color>(game.turn());
  const [history, setHistory] = useState<Move[]>(
    game.history({ verbose: true })
  );
  const [fenHistory, setFenHistory] = useState<string[]>([game.fen()]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const lastIndex = game.history().length;
  const canPlay = currentIndex === lastIndex;

  function makeMove(
    from: Square,
    to: Square,
    promotion: PieceSymbol | undefined
  ) {
    try {
      const move = game.move({ from, to, promotion });
      setTurn(game.turn());
      setHistory(game.history({ verbose: true }));
      setFenHistory((prev) => [...prev.slice(0, currentIndex + 1), game.fen()]);
      setCurrentIndex((prev) => prev + 1);
      return move;
    } catch (err) {
      return null;
    }
  }

  function resetGame() {
    const newGame = new Chess();
    setTurn(newGame.turn());
    setFenHistory([newGame.fen()]);
    setGame(newGame);
    setCurrentIndex(0);
  }

  function goTo(index: number) {
    if (index >= 0 && index < fenHistory.length) {
      setCurrentIndex(index);
      return true;
    }
    return false;
  }

  return (
    <GameContext.Provider
      value={{
        game,
        turn,
        history,
        fenHistory,
        currentIndex,
        lastIndex,
        canPlay,
        makeMove,
        resetGame,
        goTo,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
