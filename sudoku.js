let selectedNumber;
let isClickedErase = false;
let isGameOn = false;
let seconds = 0;
let isStartGoOn = false;
let lastClickedCell = null;
let timer;
let sudokuBoard = [];
let solvedSudokuBoard = [];

const clearBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const sudokuContainer = document.getElementById("sudoku-container");
const startButton = document.getElementById("start-button");
const checkButton = document.getElementById("check-button");
const eraseButton = document.getElementById("erase-button");
const stopButton = document.getElementById("stop-button");
const timerElement = document.getElementById("timer");

//When you restart the page, you will see empty sudoku board on the page.

function startTimer() {
    isStartGoOn = true;
    timer = setInterval(function () {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const formattedSeconds = seconds % 60;
        const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${formattedSeconds < 10 ? '0' : ''}${formattedSeconds}`;
        timerElement.textContent = formattedTime;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    isStartGoOn = false;
}

function resetTimer() {
    clearInterval(timer);
    isStartGoOn = false;
    seconds = 0;
    timerElement.textContent = "00:00";
}

stopButton.addEventListener("click", function () {
    if (isStartGoOn) {
        stopTimer();
        isGameOn = false;
        stopButton.classList.add("clicked");
    } else {
        startTimer();
        isGameOn = true;
        stopButton.classList.remove("clicked");
    }

});

function createSudoku(table) {
    sudokuContainer.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const row = document.createElement("div");
        row.classList.add("sudoku-row");

        for (let j = 0; j < 9; j++) {
            const cell = document.createElement("div");
            cell.classList.add("sudoku-cell");

            cell.dataset.row = i;
            cell.dataset.col = j;

            if (table[i][j] !== 0) {
                cell.textContent = table[i][j];
            } else {
                cell.textContent = "";
            }


            row.appendChild(cell);
        }

        sudokuContainer.appendChild(row);
    }

}

sudokuContainer.addEventListener("click", function (event) {
    const clickedCell = event.target.closest(".sudoku-cell");
    if (!clickedCell) return;

    const i = parseInt(clickedCell.dataset.row);
    const j = parseInt(clickedCell.dataset.col);

    if (isClickedErase === true && sudokuBoard[i][j] === 0 && isGameOn === true) {
        clickedCell.textContent = '';
    } else if (selectedNumber !== null && sudokuBoard[i][j] === 0 && isGameOn == true) {
        clickedCell.textContent = selectedNumber;
    }
});



startButton.addEventListener("click", function () {
    const confirmed = confirm("                 Are you sure?\nDo you want to create a new game?");
    if (confirmed) {
        resetTimer();
        stopButton.classList.remove("clicked");
        solvedSudokuBoard = generateSudoku();
        let copiedMatrix = [...solvedSudokuBoard.map(row => [...row])];
        sudokuBoard = removeCells(copiedMatrix, 1);
        createSudoku(sudokuBoard);
        isGameOn = true;
        startTimer();
    }
});

eraseButton.addEventListener("click", function () {
    if (isClickedErase) {
        eraseButton.classList.remove("clicked");
        isClickedErase = false;
    } else {
        eraseButton.classList.add("clicked");
        isClickedErase = true;
        if (lastClickedCell !== null) {
            lastClickedCell.classList.remove("clicked");
            lastClickedCell = null;
        }
    }
});

//Sudoku Compare Part

function compareSudokus(sudokuValues, sudokuData) {
    const sudokuValues2D = [];

    for (let i = 0; i < 9; i++) {
        sudokuValues2D.push(sudokuValues.slice(i * 9, (i + 1) * 9));
    }

    console.log("sudokuValues2D:", sudokuValues2D);
    console.log("sudokuData:", sudokuData);

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const parsedValue = parseInt(sudokuValues2D[i][j], 10);

            if (parsedValue !== sudokuData[i][j]) {
                return false;
            }
        }
    }

    return true;
}


checkButton.addEventListener("click", function () {
    if (isGameOn === false) {
        alert("The game not started...");
    } else {
        const confirmed = confirm("Do you want to check the sudoku board?");
        if (confirmed) {
            const sudokuCells = document.querySelectorAll(".sudoku-cell");
            const sudokuValues = [];

            sudokuCells.forEach(function (cell) {
                const value = cell.textContent;
                sudokuValues.push(value);
            });

            const isSudokuEqual = compareSudokus(sudokuValues, solvedSudokuBoard);

            if (isSudokuEqual) {
                alert("Correct Answer!");
                isGameOn = false;
                stopTimer();
            } else {
                alert("False Answer!");
            }
        }
    }


});

document.addEventListener("DOMContentLoaded", function () {
    createSudoku(clearBoard);
    isGameOn = false;
});


document.addEventListener("DOMContentLoaded", function () {

    const numbersContainer = document.getElementById("numbers-container");


    function createNumbers() {
        const row = document.createElement("div");
        row.classList.add("numbers-row");
        for (let i = 1; i <= 9; i++) {
            const cell = document.createElement("div");
            cell.classList.add("numbers-cell");
            cell.textContent = i;

            cell.addEventListener("click", function () {
                if (lastClickedCell !== null) {
                    lastClickedCell.classList.remove("clicked");
                }

                lastClickedCell = cell;
                selectedNumber = i;

                cell.classList.add("clicked");
                if (isClickedErase) {
                    eraseButton.classList.remove("clicked");
                    isClickedErase = false;
                }
            });

            row.appendChild(cell);
        }
        numbersContainer.appendChild(row);
    }

    createNumbers();
});

// SUDOKU GENERATOR PART
//Solving sudoku algorithms are here

function solveSudoku(board) {
    const emptyCell = findEmptyCell(board);

    if (!emptyCell) {
        return true;
    }

    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
        const randomNumber = Math.floor(Math.random() * 9) + 1;
        if (isValidMove(board, row, col, randomNumber)) {
            board[row][col] = randomNumber;

            if (solveSudoku(board)) {
                return true;
            }

            board[row][col] = 0;
        }
    }

    return false;
}

function findEmptyCell(board) {

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                return [row, col];
            }
        }
    }

    return null;
}

function isValidMove(board, row, col, num) {

    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false;
        }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }

    return true;
}

//---------------------------------------------


//Genarate sudoku algorithms are here

function generateSudoku() {
    const sudoku = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    solveSudoku(sudoku);

    return sudoku;
}

function removeCells(board, count) {

    for (let i = 0; i < count; i++) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        board[row][col] = 0;
    }

    return board;
}