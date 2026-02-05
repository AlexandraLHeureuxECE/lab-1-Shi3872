const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameActive = true;

const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Create board cells
function createBoard() {
  boardElement.innerHTML = "";

  board.forEach((_, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("tabindex", "0");
    cell.dataset.index = index;

    cell.addEventListener("click", handleMove);
    cell.addEventListener("keydown", handleKeyboardMove);

    boardElement.appendChild(cell);
  });
}

// Handle mouse click
function handleMove(e) {
  const index = e.target.dataset.index;
  makeMove(index);
}

// Handle keyboard play
function handleKeyboardMove(e) {
  const index = Number(e.target.dataset.index);

  // Place mark
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    makeMove(index);
  }

  // Navigation
  let targetIndex = null;

  if (e.key === "ArrowRight") targetIndex = index + 1;
  if (e.key === "ArrowLeft") targetIndex = index - 1;
  if (e.key === "ArrowDown") targetIndex = index + 3;
  if (e.key === "ArrowUp") targetIndex = index - 3;

  if (targetIndex !== null && targetIndex >= 0 && targetIndex < 9) {
    const nextCell = document.querySelector(`[data-index='${targetIndex}']`);
    if (nextCell) nextCell.focus();
  }
}

// Game logic
function makeMove(index) {
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  updateBoard();

  if (checkWinner()) {
    statusElement.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== null)) {
    statusElement.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusElement.textContent = `Player ${currentPlayer}'s turn`;
}

function updateBoard() {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    cell.textContent = board[i] || "";
  });
}

function checkWinner() {
  return winningCombos.some(combo => {
    const [a, b, c] = combo;
    return board[a] &&
           board[a] === board[b] &&
           board[a] === board[c];
  });
}

// Restart game
function restartGame() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameActive = true;
  statusElement.textContent = "Player X's turn";
  createBoard();
}

restartBtn.addEventListener("click", restartGame);

// Initialize
createBoard();
