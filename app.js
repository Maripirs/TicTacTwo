function createGame() {
    const boardSize = 3;
    const defaultState = {
        board: [],
        size: boardSize,
        win: { over: false },
        turn: 1,
        playing: true,
        messages: {
            start: "To begin make a move or press play for the computer to start",
            player: "It's your turn!",
            cpu: "Computer is playing",
            tie: "It's a tie!",
            pWin: "You win!",
            cWin: "You lose :(",
        },
    };
    let boardState = { ...defaultState };
    let htmlElement = {
        msg: document.getElementById("msg"),
        btn: document.getElementById("btn"),
    };
    function init() {
        generateBoard(boardSize);
        htmlElement.btn.onclick = handleClearPlay;
    }

    function handleClick(e) {
        htmlElement.btn.innerHTML = "Clear";

        const cell = e.currentTarget;
        //Check that the space is empty
        console.log(boardState);
        if (
            boardState.board[cell.gridX][cell.gridY] != 0 ||
            boardState.win.over ||
            !boardState.playing
        ) {
            console.log("invalid move");
            return;
        }
        //
        boardState.board[cell.gridX][cell.gridY] = "X";
        cell.innerHTML = "X";
        checkWin(boardState, "X", htmlElement);
        boardState.turn += 1;
        if (boardState.win.over) {
            drawWin(htmlElement, boardState);
            htmlElement.msg.innerHTML = boardState.messages.pWin;
            return;
        }
        console.log(boardState.turn);
        if (boardState.turn > 2) {
            htmlElement.msg.innerHTML = boardState.messages.cpu;
            boardState.playing = false;
            setTimeout(function () {
                cpuTurn(boardState, htmlElement);
                checkWin(boardState, "O");
                boardState.turn += 1;
                if (boardState.win.over) {
                    drawWin(htmlElement, boardState);
                    if (boardState.win.direction == "n") {
                        htmlElement.msg.innerHTML = boardState.messages.tie;
                    } else {
                        htmlElement.msg.innerHTML = boardState.messages.cWin;
                    }
                    return;
                }
                htmlElement.msg.innerHTML = boardState.messages.player;
                boardState.playing = true;
            }, 1000);
        } else {
            htmlElement.msg.innerHTML = boardState.messages.player;
        }
    }
    function drawWin(htmlElement, boardState) {
        if (boardState.win.direction == "n") {
            let fullBoard = document.getElementById("board");
            fullBoard.classList.add("tie");
        }
        if (boardState.win.direction == "h") {
            for (let i = 0; i < boardState.size; i++) {
                htmlElement.cells[boardState.win.location][i].classList.add(
                    "winner"
                );
            }
            return;
        }
        if (boardState.win.direction == "v") {
            for (let i = 0; i < boardState.size; i++) {
                htmlElement.cells[i][boardState.win.location].classList.add(
                    "winner"
                );
            }
            return;
        }
        if (boardState.win.direction == "d") {
            for (let i = 0; i < boardState.size; i++) {
                htmlElement.cells[i][i].classList.add("winner");
            }
            return;
        }
        if (boardState.win.direction == "u") {
            for (let i = 0; i < boardState.size; i++) {
                htmlElement.cells[boardState.size - 1 - i][i].classList.add(
                    "winner"
                );
            }
            return;
        }
    }
    function cpuStart(boardState, htmlElement) {
        boardState.board[0][0] = "O";
        htmlElement.cells[0][0].innerHTML = "O";
        boardState.board[0][2] = "O";
        htmlElement.cells[0][2].innerHTML = "O";
        boardState.turn = 3;
    }
    function cpuTurn(boardState, htmlElement) {
        if (boardState.turn % 2 == 1) {
            //CPu went second. Reactive game
            [r, c] = checkAlmost(boardState, "X");
            if (r == -1) {
                [r, c] = checkAlmost(boardState, "O");
            }
            if (r == -1) {
                [r, c] = [1, 1];
            }
            console.log(`Coors: ${r} ${c}`);
            boardState.board[r][c] = "O";
            htmlElement.cells[r][c].innerHTML = "O";
        } else {
            //Cpu went first, offensive scripted play
            if (boardState.board[0][1] == 0) {
                boardState.board[0][1] = "O";
                htmlElement.cells[0][1].innerHTML = "O";
            } else if (boardState.board[2][0] == 0) {
                boardState.board[2][0] = "O";
                htmlElement.cells[2][0].innerHTML = "O";
            } else if (boardState.board[1][0] == 0) {
                boardState.board[1][0] = "O";
                htmlElement.cells[1][0].innerHTML = "O";
            } else if (boardState.board[1][1] == 0) {
                boardState.board[1][1] = "O";
                htmlElement.cells[1][1].innerHTML = "O";
            }
        }
    }
    function generateBoard(numRows) {
        htmlElement.cells = Array.from({ length: boardSize }, () =>
            Array(boardSize).fill(null)
        );
        boardState = { ...defaultState };
        boardState.board = Array.from({ length: boardSize }, () =>
            Array(boardSize).fill(0)
        );
        const board = document.getElementById("board");
        board.innerHTML = "";
        board.style.gridTemplateColumns = `repeat(${numRows}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
        const totalCells = numRows * numRows;
        board.classList.remove("tie");

        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numRows; j++) {
                const cell = document.createElement("div");
                cell.setAttribute("role", "button");
                cell.onclick = handleClick;
                //Find edges
                if (i == 0) cell.classList.add("top");
                if (j == 0) cell.classList.add("left");
                if (j == numRows - 1) cell.classList.add("right");
                if (i == numRows - 1) cell.classList.add("bottom");

                cell.classList.add("cell");
                cell.innerHTML = ` `;
                cell.gridX = i;
                cell.gridY = j;
                board.appendChild(cell);
                htmlElement.cells[i][j] = cell;
            }
        }
        htmlElement.msg.innerHTML = boardState.messages.start;
    }
    function checkAlmost(boardState, player) {
        let size = boardState.size;
        let coors = [-1, -1];
        for (let i = 0; i < size; i++) {
            let spaces = 0;
            for (let j = 0; j < size; j++) {
                if (boardState.board[i][j] == player) {
                    spaces = 0;
                    break;
                } else if (boardState.board[i][j] == 0) {
                    spaces++;
                    coors = [i, j];
                }
            }
            if (spaces == 1) {
                return coors;
            }
        }
        for (let i = 0; i < size; i++) {
            let spaces = 0;

            for (let j = 0; j < size; j++) {
                if (boardState.board[j][i] == player) {
                    spaces = 0;
                    break;
                } else if (boardState.board[j][i] == 0) {
                    spaces++;
                    coors = [j, i];
                }
            }
            if (spaces == 1) {
                return coors;
            }
        }

        let spaces = 0;
        for (let i = 0; i < size; i++) {
            if (boardState.board[i][i] == player) {
                spaces = 0;
                break;
            } else if (boardState.board[i][i] == 0) {
                spaces++;
                coors = [i, i];
            }
        }
        if (spaces == 1) {
            return coors;
        }

        spaces = 0;
        for (let i = 0; i < size; i++) {
            if (boardState.board[size - 1 - i][i] == player) {
                spaces = 0;
                break;
            } else if (boardState.board[size - i - 1][i] == 0) {
                spaces++;
                coors = [size - 1 - i, i];
            }
        }
        if (spaces == 1) {
            return coors;
        }
        return [-1, -1];
    }
    function checkWin(boardSt, player) {
        let numRows = boardSt.size;
        let complete = true;

        for (let i = 0; i < numRows; i++) {
            complete = true;
            for (let j = 0; j < numRows; j++) {
                if (boardSt.board[i][j] != player) {
                    complete = false;
                    break;
                }
            }
            if (complete) {
                boardSt.win = { direction: "h", location: i, over: true };
                return;
            }
        }
        for (let i = 0; i < numRows; i++) {
            let complete = true;
            for (let j = 0; j < numRows; j++) {
                if (boardSt.board[j][i] != player) {
                    complete = false;
                    break;
                }
            }
            if (complete) {
                boardSt.win = { direction: "v", location: i, over: true };
                return;
            }
        }
        complete = true;
        for (let j = 0; j < numRows; j++) {
            if (boardSt.board[j][j] !== player) {
                complete = false;
                break;
            }
        }
        if (complete) {
            boardSt.win = { direction: "d", location: 0, over: true };
            return;
        }
        complete = true;
        for (let j = 0; j < numRows; j++) {
            if (boardSt.board[numRows - 1 - j][j] !== player) {
                complete = false;
                break;
            }
        }
        if (complete) {
            boardSt.win = { direction: "u", location: 0, over: true };
            return;
        }
        if (boardSt.turn == 9) {
            boardSt.win = { direction: "n", location: 0, over: true };
        }
    }

    function handleClearPlay() {
        let boardArr = Array.from({ length: boardState.size }, () =>
            Array(boardState.size).fill(0)
        );
        boardState = { ...defaultState };
        boardState.board = boardArr;
        generateBoard(3);
        if (htmlElement.btn.innerHTML[0] != "C") {
            console.log("Cpu goes first");
            cpuStart(boardState, htmlElement);
            htmlElement.btn.innerHTML = "Clear";
        } else {
            console.log("Clear");
            htmlElement.btn.innerHTML = "Play";
        }
        htmlElement.msg.innerHTML = boardState.messages.start;
    }
    return { init };
}
window.onload = function () {
    const game = createGame();
    game.init();
};
