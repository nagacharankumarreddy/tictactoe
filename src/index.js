import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square({ value, onClick }) {
  const className = `square ${value}`;
  return (
    <button className={className} onClick={onClick}>
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
      return squares[a];
    }
  }

  return null;
}

function Board() {
  const [size, setSize] = useState(3);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares, size)) return;
    const nextSquares = [...squares];
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setSquares(Array(size * size).fill(null));
    setXIsNext(true);
  };

  const handleLevelChange = (e) => {
    const newSize = parseInt(e.target.value);
    setSize(newSize);
    setSquares(Array(newSize * newSize).fill(null));
    setXIsNext(true);
  };

  const winner = calculateWinner(squares, size);
  let status;

  if (winner) {
    status = `Winner: ${winner}`;
  } else if (squares.every((square) => square !== null)) {
    status = "It's a Draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="board-container">
      <div className="controls">
        <label>Difficulty: </label>
        <select onChange={handleLevelChange} value={size}>
          <option value={3}>Easy (3x3)</option>
          <option value={4}>Medium (4x4)</option>
          <option value={5}>Hard (5x5)</option>
        </select>
      </div>
      <div className="status">{status}</div>
      <button className="resetbut" onClick={resetGame}>
        Reset
      </button>
      {[...Array(size)].map((_, row) => (
        <div className="board-row" key={row}>
          {[...Array(size)].map((_, col) => {
            const index = row * size + col;
            return (
              <Square
                key={index}
                value={squares[index]}
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
