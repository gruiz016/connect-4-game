//All the dom elements selected to make any dom munipulations.
const htmlBoard = document.querySelector("#board");
const p1 = document.querySelector(".player-1");
const p2 = document.querySelector(".player-2");
const reset = document.querySelector("button");
//the board restrictions.
const WIDTH = 7;
const HEIGHT = 6;
//Locks the board.
let lockBoard = false;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

reset.addEventListener("click", () => location.reload());

//creates the board with the restrictions established above.
function makeBoard() {
  // I used a for loop to create the inner and outer array's
  for (let i = 0; i < HEIGHT; i++) {
    board.push([]); // pushed the empty array for the length of height
    //This is the inner loop that pushes null for the length of the width
    for (let j = 0; j < WIDTH; j++) {
      board[i].push(null);
    }
  }
  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  //creates the table for the game board on the DOM.
  const top = document.createElement("tr");
  //set the top tr to id of column-top, so that we can use the css to hover, touch, etc.
  top.setAttribute("id", "column-top");
  //Listens for any clicks on the tr and passes the function defined below on any clicks within this column.
  top.addEventListener("click", handleClick);

  //This creates a td for the width length of the board
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    //sets id to the index of the length of the width
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  for (let y = 0; y < HEIGHT; y++) {
    //Outter loop creates a row based on length of the height.
    const row = document.createElement("tr");
    //Inner loop creates all the cells for the game
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      //We set an id for each cell inside of the row to read height(index)-width(index).
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

function findSpotForCol(x) {
  //This loop loops through the column from top to bottom.
  for (let y = HEIGHT - 1; y >= 0; y--) {
    //If the cell in the column is false we return y otherwise if true return null.
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  //if the board is locked, nothing is placed on the table
  if (lockBoard) return;
  // if board is not locked, we create a div.
  const piece = document.createElement("div");
  //add the classes of piece to create the div with the right size. Get the color based on the player with p${currentPlayer}. Animate the fall with the fall class.
  piece.classList.add("piece");
  piece.classList.add(`p${currPlayer}`);
  piece.classList.add("fall");

  //we append the div to the cell that has the corresponding y(column), x(row) coordinates we created ealier in makeHtmlBoard.
  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  // when the game is over we lock the board to avoid players continuing to place pieces on board.
  lockBoard = true;
  const mg = msg;
  //I delayed the alert so that the last piece can drop befor we alert the winner.
  setTimeout(() => alert(mg), 1000);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  //This locks a players piece to a column - row coordinate into the board variable.
  board[y][x] = currPlayer;
  // place piece in board and add to HTML table
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // this if statement checks if every row and cell on the board is not null, if full board has a player number (either 1 or 2) throughout the nested arrays then we return end game.
  if (board.every(row => row.every(cell => cell))) {
    return endGame("There is a Tie!, Press start over!");
  }

  // switch players
  if (currPlayer === 1) {
    currPlayer = 2;
    //I added a guide on who's turn it is, the game starts with player 1 going first. So we remove the class active and set it to player two once it is thier turn.
    p1.classList.remove("active");
    p2.classList.add("active");
  } else {
    currPlayer = 1;
    //Reversal of the above, when the player switches.
    p1.classList.add("active");
    p2.classList.remove("active");
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //this loop loops through the nested array to check vaules inside of the board varible.
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //This how you win horizontal
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3]
      ];
      //How you win vertical
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x]
      ];
      //this checks if you win with a diagnol right
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3]
      ];
      //this checks if you win with a diagnol left
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3]
      ];
      //we insert the four arrays we made above with the nested for loop into the _win function.
      // this is the condition in which we return true if either if these conditions are met.
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
