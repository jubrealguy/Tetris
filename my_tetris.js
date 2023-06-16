// Generating a random integer between the range of min and max after rounding up to integer
function generateRandomInt(min, max) {
  const intMin = Math.ceil(min);
  const intMax = Math.floor(max);

  return Math.floor(Math.random() * (intMax - intMin + 1)) + intMin;
}
  
  // This function generates a new tetromino sequence
const generateRandomTetromino = () => {
    const tetrominosequence = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  
    while (tetrominosequence.length) {
      const randIndex = generateRandomInt(0, tetrominosequence.length - 1);
      const randTetromino = tetrominosequence.splice(randIndex, 1)[0];
      tetrominoSequence.push(randTetromino);
    }
  }
  
  // This function generates a random tetromino sequence which will be the next
  function nextTetromino() {
    //call the function generateRandomTetromino when array is empty
    if (tetrominoSequence.length === 0) {
      generateRandomTetromino();
    }
  
    const name = tetrominoSequence.pop();

    const matrix = tetrominos[name];
  
    const column = Math.floor((playfield[0].length - matrix[0].length) / 2);
  
    const row = name === 'I' ? -1 : -2;
  
    // return the name of piece, current rotation matrix, current row and current col
    return {
      name: name,
      matrix: matrix,
      row: row,
      col: column        
    };
  }
  
  // rotating a square matrix 90degrees clockwise and returning the resultingmatrix
  function rotate(matrix) {
    const N = matrix.length;
    const resultingMatrix = [];
  
    for (let i = 0; i < N; i++) {
      const newRow = [];
      for (let j = 0; j < N; j++) {
        newRow.push(matrix[N - j - 1][i]);
      }
      resultingMatrix.push(newRow);
    }
  
    return resultingMatrix;
  }
  
  // check to see if the new matrix is a valid move within the game
  function moveValid(matrix, cellRow, cellColumn) {
    const playfieldHeight = playfield.length;
    const playfieldWidth = playfield[0].length;
  
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (
          matrix[row][col] &&
          (cellColumn + col < 0 || cellColumn + col >= playfieldWidth ||
            cellRow + row >= playfieldHeight || playfield[cellRow + row][cellColumn + col])
        ) {
          return false;
        }
      }
    }
  
    return true;
  }
  
  // The positioning and handling of the tetromino pieces in the game
  function placingTetromino() {
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
          const targetRow = tetromino.row + row;
          const targetCol = tetromino.col + col;
  
          // End Game if any part goes offscreen
          if (targetRow < 0) {
            return displayGameOver();
          }
  
          playfield[targetRow][targetCol] = tetromino.name;
        }
      }
    }
  
    // Check for line clears
    for (let row = playfield.length - 1; row >= 0; row--) {
      if (playfield[row].every((cell) => !!cell)) {
        
        for (let r = row; r >= 0; r--) {
          for (let c = 0; c < playfield[r].length; c++) {
            playfield[r][c] = playfield[r - 1][c];
          }
        }
      }
    }
  
    tetromino = nextTetromino();
  }
  
  // show the game over screen
  function displayGameOver() {
    cancelAnimationFrame(reqAnimatonFrame);
    gameOver = true;
  
    const rectHeight = 60;
    const rectY = canvas.height / 2 - rectHeight / 2;
  
    context.fillStyle = 'rgba(0, 0, 0, 0.75)';
    context.fillRect(0, rectY, canvas.width, rectHeight);
  
    context.fillStyle = 'white';
    context.font = '40px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 3);
  }
  
  const canvas = document.getElementById('tetris_game');
  const context = canvas.getContext('2d');
  const grid = 32;
  const tetrominoSequence = [];
  
  // A 10 x 20 playfield with some off-field rows
  const playfield = [];
  
  for (let row = -2; row < 20; row++) {
    playfield[row] = [];
  
    for (let col = 0; col < 10; col++) {
      playfield[row][col] = 0;
    }
  }
  
  // Drawing each tetromino
  const tetrominos = {
    'I': [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    'J': [
      [1,0,0],
      [1,1,1],
      [0,0,0],
    ],
    'L': [
      [0,0,1],
      [1,1,1],
      [0,0,0],
    ],
    'O': [
      [1,1],
      [1,1],
    ],
    'S': [
      [0,1,1],
      [1,1,0],
      [0,0,0],
    ],
    'Z': [
      [1,1,0],
      [0,1,1],
      [0,0,0],
    ],
    'T': [
      [0,1,0],
      [1,1,1],
      [0,0,0],
    ]
  };
  
  // color of each tetromino
  const colors = {
    'I': 'cyan', 'O': 'yellow', 'T': 'purple', 'S': 'green', 'Z': 'red', 'J': 'blue', 'L': 'orange'
  };
  
  let count = 0;
  let tetromino = nextTetromino();
  let reqAnimatonFrame = null;
  let gameOver = false;
  
  // Function responsible for the main game, it updates amd renders the state ofthe game repeatedly
  function loop() {
    reqAnimatonFrame = requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the playfield
    for (let row = 0; row < playfield.length; row++) {
      for (let col = 0; col < playfield[row].length; col++) {
        const cell = playfield[row][col];
        if (cell) {
          const color = colors[cell];
          context.fillStyle = color;
          context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
        }
      }
    }
  
    // Draw the active tetromino
    if (tetromino) {
      if (++count > 35) {
        tetromino.row++;
        count = 0;
  
        if (!moveValid(tetromino.matrix, tetromino.row, tetromino.col)) {
          tetromino.row--;
          placingTetromino();
        }
      }
  
      const tetrominoColor = colors[tetromino.name];
      context.fillStyle = tetrominoColor;
  
      for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
          if (tetromino.matrix[row][col]) {
            const posX = (tetromino.col + col) * grid;
            const posY = (tetromino.row + row) * grid;
            context.fillRect(posX, posY, grid - 1, grid - 1);
          }
        }
      }
    }
  }
  
  // Moving the tetromino
  function moveTetromino(direction) {
    const col = tetromino.col + direction;
    if (moveValid(tetromino.matrix, tetromino.row, col)) {
      tetromino.col = col;
    }
  }
  
  // Rotating the tetromino
  function rotateTetromino() {
    const matrix = rotate(tetromino.matrix);
    if (moveValid(matrix, tetromino.row, tetromino.col)) {
      tetromino.matrix = matrix;
    }
  }
  
  // Dropping the tetromino
  function dropTetromino() {
    const row = tetromino.row + 1;
    if (!moveValid(tetromino.matrix, row, tetromino.col)) {
      tetromino.row = row - 1;
      placeTetromino();
      return;
    }
    tetromino.row = row;
  }

  // listening to keyboard events to move the active tetromino
  document.addEventListener('keydown', function(e) {
    if (gameOver) {
      return;
    }
  
    switch (e.which) {
      case 37: // Left arrow key (move left)
        moveTetromino(-1);
        break;
      case 39: // Right arrow key (move right)
        moveTetromino(1);
        break;
      case 38: // Up arrow key (rotate)
        rotateTetromino();
        break;
      case 40: // Down arrow key (drop)
        dropTetromino();
        break;
    }
  });
  
  // start the game
  reqAnimatonFrame = requestAnimationFrame(loop);