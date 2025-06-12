let currentTurn = 1;
let player1 = 'x';
let player2 = 'o'
let boardSize = 3;

function handleClick(e){
	const cell = e.currentTarget;
  currentValue = currentTurn % 3 == 0 ? player2 : player1;
  cell.innerHTML = `${currentValue}`;
  currentTurn++;
}

function generateBoard(numRows){
	const board = document.getElementById("board");
  board.innerHTML ="";
  board.style.gridTemplateColumns =`repeat(${numRows}, 1fr)`;
    board.style.gridTemplateRows =`repeat(${numRows}, 1fr)`;
  const totalCells = numRows*numRows
  
  for(let i = 0; i < numRows; i++){
  	for(let j = 0; j < numRows; j++){
    	const cell = document.createElement("div");
      cell.setAttribute("role", "button");
      cell.onclick = handleClick;
			if(i == 0){
    		cell.classList.add("top");
    	}
      if(j  == 0){
        cell.classList.add("left");
      }
      if(j == numRows-1){
        cell.classList.add("right");
      }
      if(i ==numRows-1){
        cell.classList.add("bottom");
      }
      cell.classList.add("cell");
      cell.innerHTML = `r${i}c${j}`;
      cell.id =`r${i}c${j}`
      board.appendChild(cell);
    }
  }

}

generateBoard(boardSize);
cells = document.getElementsByClassName("cell");
currentPlayer = 'X';

