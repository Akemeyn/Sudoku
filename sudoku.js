let selectedNumber;
let isClickedErase = false;
let isGameOn = false;
let seconds = 0;
let isStartGoOn = false;
let lastClickedCell = null;
let timer;

const sudokuContainer = document.getElementById("sudoku-container");
const startButton = document.getElementById("start-button");
const checkButton = document.getElementById("check-button");
const eraseButton = document.getElementById("erase-button");
const stopButton = document.getElementById("stop-button");
const timerElement = document.getElementById("timer");

//When you restart the page, you will see empty sudoku board on the page.

document.addEventListener("DOMContentLoaded", function () {

    createSudoku(clearBoard);
    isGameOn = false;
});

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

stopButton.addEventListener("click", function () {
    if(isStartGoOn){
        stopTimer();
    }else{
        isStartGoOn = true;
        startTimer();
    }
    
});

function createSudoku(table) {
    const sudokuSize = 9;
    sudokuContainer.innerHTML = '';

    for (let i = 0; i < sudokuSize; i++) {
        const row = document.createElement("div");
        row.classList.add("sudoku-row");

        for (let j = 0; j < sudokuSize; j++) {
            const cell = document.createElement("div");
            cell.classList.add("sudoku-cell");

            cell.dataset.row = i;
            cell.dataset.col = j

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

    if (isClickedErase === true && sudokuData[i][j] === 0) {
        clickedCell.textContent = '';
    } else if (selectedNumber !== null && sudokuData[i][j] === 0) {
        clickedCell.textContent = selectedNumber;
    }
});


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
]

const sudokuData = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

const solvedSudoku = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

startButton.addEventListener("click", function () {
    const confirmed = confirm("                 Are you sure?\nDo you want to create a new game?");
    if (confirmed) {
        sudokuTemp = [...sudokuData];
        createSudoku(sudokuTemp);
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

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (parseInt(sudokuValues2D[i][j], 10) !== sudokuData[i][j]) {
                return false;
            }
        }
    }

    return true;
}

checkButton.addEventListener("click", function () {
    const confirmed = confirm("Do you want to check the sudoku board?");
    if (confirmed) {
        const sudokuCells = document.querySelectorAll(".sudoku-cell");
        const sudokuValues = [];

        sudokuCells.forEach(function (cell) {
            const value = cell.textContent;
            sudokuValues.push(value);
        });

        const isSudokuEqual = compareSudokus(sudokuValues, solvedSudoku);

        if (isSudokuEqual) {
            alert("Correct Answer!");
        } else {
            alert("False Answer!");
        }
    }

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

