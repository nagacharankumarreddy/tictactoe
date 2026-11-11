import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square({ value, onClick, isWinning, label }) {
  const className = `square ${value || ""} ${isWinning ? "win" : ""}`;
  return (
    <button className={className} onClick={onClick} aria-label={label}>
      {value}
    </button>
  );
}

function calculateWinner(squares, size) {
  const lines = [];

  for (let r = 0; r < size; r++) {
    lines.push([...Array(size)].map((_, i) => r * size + i));
  }

  for (let c = 0; c < size; c++) {
    lines.push([...Array(size)].map((_, i) => i * size + c));
  }

  lines.push([...Array(size)].map((_, i) => i * (size + 1)));

  lines.push([...Array(size)].map((_, i) => (i + 1) * (size - 1)));

  for (const [a, ...rest] of lines) {
    if (squares[a] && rest.every((i) => squares[i] === squares[a])) {
      return { winner: squares[a], line: [a, ...rest] };
    }
  }

  return null;
}

function Board() {
  const [size, setSize] = useState(3);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const result = calculateWinner(squares, size);
  const winner = result ? result.winner : null;
  const winningLine = result ? result.line : [];
  const isDraw = !winner && squares.every((square) => square !== null);
  const inProgress = !winner && !isDraw;

  const handleClick = (i) => {
    if (squares[i] || winner) return;
    const nextSquares = [...squares];
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    const outcome = calculateWinner(nextSquares, size);
    if (outcome) {
      setScores((prev) => ({ ...prev, [outcome.winner]: prev[outcome.winner] + 1 }));
    } else if (nextSquares.every((square) => square !== null)) {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    }
  };

  const resetGame = () => {
    setSquares(Array(size * size).fill(null));
    setXIsNext(true);
  };

  const handleLevelChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setSize(newSize);
    setSquares(Array(newSize * newSize).fill(null));
    setXIsNext(true);
  };

  let status;
  if (winner) {
    status = `${winner} wins!`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `${xIsNext ? "X" : "O"}'s turn`;
  }

  return (
    <div className="board-container">
      <div className="controls">
        <label htmlFor="level">Difficulty: </label>
        <select id="level" onChange={handleLevelChange} value={size}>
          <option value={3}>Easy (3x3)</option>
          <option value={4}>Medium (4x4)</option>
          <option value={5}>Hard (5x5)</option>
        </select>
      </div>

      <div className="scoreboard">
        <div className={`score-chip x ${inProgress && xIsNext ? "active" : ""}`}>
          <span>Player X</span>
          <strong>{scores.X}</strong>
        </div>
        <div className="score-chip draws">
          <span>Draws</span>
          <strong>{scores.draws}</strong>
        </div>
        <div className={`score-chip o ${inProgress && !xIsNext ? "active" : ""}`}>
          <span>Player O</span>
          <strong>{scores.O}</strong>
        </div>
      </div>

      <div className={`status ${winner ? `won-${winner}` : ""}`} aria-live="polite">
        {status}
      </div>
      <button className="resetbut" onClick={resetGame}>
        {winner || isDraw ? "Play again" : "New game"}
      </button>
      {[...Array(size)].map((_, row) => (
        <div className="board-row" key={row}>
          {[...Array(size)].map((_, col) => {
            const index = row * size + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                isWinning={winningLine.includes(index)}
                label={`Row ${row + 1}, column ${col + 1}, ${squares[index] || "empty"}`}
                onClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Game() {
  return (
    <div className="fullscreen-container">
      <div className="game">
        <h2>Tic-Tac-Toe</h2>
        <p>Choose a difficulty level to play a dynamic grid game!</p>
        <Board />
      </div>
    </div>
  );
}

ReactDOM.render(<Game />, document.getElementById("root"));
