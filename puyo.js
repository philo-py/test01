const ROWS = 12;
const COLS = 6;
const COLORS = ["red", "blue", "green", "yellow"];
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

let currentPuyo = { row: 0, col: Math.floor(COLS / 2), color: null };

// ゲームボードの描画
function renderBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = '';
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (board[row][col]) {
        cell.classList.add("puyo", board[row][col]);
      }
      if (row === currentPuyo.row && col === currentPuyo.col && currentPuyo.color) {
        cell.classList.add("puyo", currentPuyo.color);
      }
      gameBoard.appendChild(cell);
    }
  }
}

// 新しいぷよを生成
function createNewPuyo() {
  currentPuyo.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  currentPuyo.row = 0;
  currentPuyo.col = Math.floor(COLS / 2);
}

// ぷよを下に移動
function movePuyoDown() {
  if (canMove(currentPuyo.row + 1, currentPuyo.col)) {
    currentPuyo.row++;
  } else {
    board[currentPuyo.row][currentPuyo.col] = currentPuyo.color;
    checkForMatches();
    createNewPuyo();
  }
}

// 左右に移動可能かどうかを確認
function canMove(row, col) {
  return row >= 0 && row < ROWS && col >= 0 && col < COLS && !board[row][col];
}

// 連鎖確認
function checkForMatches() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const color = board[row][col];
      if (color && checkConnected(row, col, color).length >= 4) {
        removeConnected(row, col, color);
      }
    }
  }
}

// 連結しているぷよを確認する
function checkConnected(row, col, color, visited = new Set()) {
  if (
    row < 0 || row >= ROWS || col < 0 || col >= COLS ||
    board[row][col] !== color || visited.has(`${row},${col}`)
  ) return [];
  visited.add(`${row},${col}`);
  return [
    [row, col],
    ...checkConnected(row + 1, col, color, visited),
    ...checkConnected(row - 1, col, color, visited),
    ...checkConnected(row, col + 1, color, visited),
    ...checkConnected(row, col - 1, color, visited)
  ];
}

// ぷよを消す
function removeConnected(row, col, color) {
  const connected = checkConnected(row, col, color);
  connected.forEach(([r, c]) => {
    board[r][c] = null;
  });
}

// キー操作
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      if (canMove(currentPuyo.row, currentPuyo.col - 1)) {
        currentPuyo.col--;
      }
      break;
    case "ArrowRight":
      if (canMove(currentPuyo.row, currentPuyo.col + 1)) {
        currentPuyo.col++;
      }
      break;
    case "ArrowDown":
      movePuyoDown();
      break;
    case " ":
      // 回転（単体のぷよの場合、操作不要）
      break;
  }
  renderBoard();
});

// 初期化
createNewPuyo();
renderBoard();
setInterval(() => {
  movePuyoDown();
  renderBoard();
}, 1000);
