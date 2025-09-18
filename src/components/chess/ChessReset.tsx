"use client";
import { useGame } from "@/context/ChessContext";
import { useEffect, useState } from "react";

export default function ChessReset() {
  const { resetGame, lastIndex } = useGame();
  const [resetPending, setResetPending] = useState<boolean>(false);

  useEffect(() => {
    function enterPressed(e: KeyboardEvent) {
      e.preventDefault();
      if (e.key === "Enter") {
        setResetPending(false);
        resetGame();
      }
      if (e.key === "Escape") setResetPending(false);
    }
    if (resetPending) window.addEventListener("keydown", enterPressed);

    return () => {
      window.removeEventListener("keydown", enterPressed);
    };
  }, [resetPending]);

  function handleReset() {
    if (!resetPending) return setResetPending(true);
    else return setResetPending(false);
  }

  return (
    <div className="reset-container">
      <button
        className={`btn btn-primary ${(resetPending || lastIndex === 0) && "disabled"}`}
        onClick={handleReset}
        disabled={lastIndex === 0}
      >
        Nouvelle Partie
      </button>
      {resetPending && (
        <div className="reset-confirmation-container">
          <p>Voulez-vous écraser la partie existante ?</p>
          <div className="reset-choices">
            <button
              className="reset-yes"
              onClick={() => {
                setResetPending(false);
                resetGame();
              }}
            >
              Oui
            </button>
            <button className="reset-no" onClick={() => setResetPending(false)}>
              Non
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
