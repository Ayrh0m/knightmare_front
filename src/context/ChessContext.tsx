"use client";
import {
  createContext,
  useContext,
  useState,
} from "react";
import { Chess, Color, Move, PieceSymbol, Square } from "chess.js";

type GameContextType = {
  game: Chess;
  turn: "w" | "b";
  history: Move[];
  fenHistory: string[];
  currentIndex: number;
  lastIndex: number;
  canPlay: boolean;
  checkmate: Color | null;
  timeoutWinner: Color | null;
  makeMove: (
    from: Square,
    to: Square,
    promotion: PieceSymbol | undefined
  ) => Move | null;
  resetGame: () => void;
  goTo: (index: number) => boolean;
  isPromotionMove: (from: Square, to: Square, piece: PieceSymbol) => boolean;
  declareTimeout: (color: Color) => void;
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
  const [checkmate, setCheckmate] = useState<Color | null>(game.isCheckmate() ? game.turn() : null);
  const [timeoutWinner, setTimeoutWinner] = useState<Color | null>(null);

  const lastIndex = game.history().length;
  const canPlay = currentIndex === lastIndex && !checkmate && !timeoutWinner;

  function makeMove(
    from: Square,
    to: Square,
    promotion: PieceSymbol | undefined
  ) {
    if (!canPlay) {
      return null;
    }
    
    try {
      const move = game.move({ from, to, promotion });

      if (game.isCheckmate()) setCheckmate(game.turn());

      setTurn(game.turn());
      setHistory(game.history({ verbose: true }));
      setFenHistory((prev) => [...prev.slice(0, currentIndex + 1), game.fen()]);
      setCurrentIndex((prev) => prev + 1);
      return move;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  function resetGame() {
    if (game.history().length === 0) return;
    const newGame = new Chess();
    setTurn(newGame.turn());
    setFenHistory([newGame.fen()]);
    setHistory([]);
    setGame(newGame);
    setCurrentIndex(0);
    setCheckmate(null);
    setTimeoutWinner(null);
  }

  function goTo(index: number) {
    if (index >= 0 && index < fenHistory.length) {
      setCurrentIndex(index);
      return true;
    }
    return false;
  }

  function isPromotionMove(from: Square, to: Square, piece: PieceSymbol) {
    if (piece !== "p") return false;
    const rank = to[1];
    return rank === "8" || rank === "1";
  }

  function declareTimeout(color: Color) {
    setTimeoutWinner(color);
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
        checkmate,
        timeoutWinner,
        makeMove,
        resetGame,
        goTo,
        isPromotionMove,
        declareTimeout,
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
