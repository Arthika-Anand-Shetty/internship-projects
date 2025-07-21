let board = Array(9).fill(null);
let currentPlayer = "X";
let gameOver = false;
let mode = null;
let scores = { X: 0, O: 0, Draw: 0 };

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function setMode(selectedMode) {
  mode = selectedMode;
  resetGame();
  document.getElementById("status").textContent = `Mode: ${mode === "computer" ? "Vs Computer" : "2 Players"} - Player X's turn`;
}

function createBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  board.forEach((val, idx) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = idx;
    cell.addEventListener("click", handleClick);
    boardDiv.appendChild(cell);
  });
}

function handleClick(e) {
  if (gameOver || !mode) return;
  const idx = e.target.dataset.index;
  if (board[idx]) return;

  makeMove(idx, currentPlayer);

  if (mode === "computer" && !gameOver && currentPlayer === "O") {
    setTimeout(() => {
      const bestMove = minimax(board, "O").index;
      makeMove(bestMove, "O");
    }, 400);
  }
}

function makeMove(index, player) {
  board[index] = player;
  updateBoard();

  const winCombo = checkWinner(player);
  if (winCombo) {
    highlightWin(winCombo);
    document.getElementById("status").textContent = `Player ${player} wins!`;
    gameOver = true;
    scores[player]++;
    updateScores();
    return;
  }

  if (board.every(cell => cell)) {
    document.getElementById("status").textContent = "It's a draw!";
    scores.Draw++;
    updateScores();
    gameOver = true;
    return;
  }

  currentPlayer = player === "X" ? "O" : "X";
  document.getElementById("status").textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner(player) {
  return winningCombos.find(combo =>
    combo.every(index => board[index] === player)
  );
}

function highlightWin(combo) {
  combo.forEach(index => {
    document.querySelectorAll(".cell")[index].classList.add("win");
  });
}

function updateBoard() {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    cell.textContent = board[i];
    cell.classList.toggle("taken", !!board[i]);
  });
}

function updateScores() {
  document.getElementById("xScore").textContent = scores.X;
  document.getElementById("oScore").textContent = scores.O;
  document.getElementById("drawScore").textContent = scores.Draw;
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameOver = false;
  createBoard();
  if (mode) {
    document.getElementById("status").textContent = `Mode: ${mode === "computer" ? "Vs Computer" : "2 Players"} - Player X's turn`;
  } else {
    document.getElementById("status").textContent = "Choose mode to start!";
  }
}

// --- Minimax Algorithm ---
function minimax(newBoard, player) {
  const huPlayer = "X";
  const aiPlayer = "O";

  const availSpots = newBoard
    .map((val, i) => (val === null ? i : null))
    .filter(i => i !== null);

  if (checkWinnerMini(newBoard, huPlayer)) return { score: -10 };
  if (checkWinnerMini(newBoard, aiPlayer)) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    const result = minimax(newBoard, player === aiPlayer ? huPlayer : aiPlayer);
    move.score = result.score;

    newBoard[availSpots[i]] = null;
    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -Infinity;
    moves.forEach((m, i) => {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((m, i) => {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  }

  return moves[bestMove];
}

function checkWinnerMini(board, player) {
  return winningCombos.some(combo =>
    combo.every(index => board[index] === player)
  );
}

// Initialize
window.onload = () => {
  createBoard();
  updateScores();
};
