// const cells = Array.from(document.querySelectorAll('.cell'));
// const message = document.querySelector('.message');
// const restartBtn = document.querySelector('.restartBtn');

// cells.forEach(cell => {
//     cell.addEventListener('click',e => {
//         play(e);
//     });
// });

// restartBtn.addEventListener('click', restart);

// let val = ' ';
// function play(e){
//     if(e.target.textContent === ' '){ // if cell is blank
//         val === 'X' ? val = 'O' : val = 'X'; // alternate X and O
//         e.target.textContent = val;
//         checkVictory();
//     }
// } 

// function checkVictory(){
//     const winCombo = [[0,1,2],[3,4,5],[6,7,8], // 3 rows
//                     [0,3,6],[1,4,7],[2,5,8], // 3 cols
//                     [0,4,8],[2,4,6]]; // 2 diagonals

//     winCombo.forEach(combo => {
//         if(cells[combo[0]].textContent===cells[combo[1]].textContent 
//             && cells[combo[1]].textContent===cells[combo[2]].textContent 
//             && cells[combo[0]].textContent !== " "){
//             message.textContent = "Player " + val + " wins!";
//             cells.forEach(cell => {
//                 cell.classList.add("disabled");
//             });
//         }
//     })
// }

// function restart(){
//     val = ' ';
//     message.textContent = ' ';
//     cells.forEach(cell => {
//         cell.textContent = ' ';
//         cell.classList.remove("disabled");
//     });
// }

let originalBoard;
const humanPlayer = "O";
const comPlayer = "X";
let winnerFound = false;

const winCombos = [[0,1,2],[3,4,5],[6,7,8], // 3 rows
                    [0,3,6],[1,4,7],[2,5,8], // 3 cols
                    [0,4,8],[2,4,6]]; // 2 diagonals

const message = document.querySelector('.message');
const cells = Array.from(document.querySelectorAll('.cell'));
const restartBtn = document.querySelector('.restartBtn');
restartBtn.addEventListener('click', startGame);

//helper funcs
//*****************************************************************
function disableCells(){
    cells.forEach(cell => {
        cell.classList.add("disabled");
    });
}

function enableCells(){
    cells.forEach(cell => {
        cell.classList.remove("disabled");
    });
}
//*****************************************************************

startGame();

function startGame(){
    winnerFound = false;
    message.textContent = ' ';
    originalBoard = Array.from(Array(9).keys()); //create array with 9 elems, values from 0-8.
    enableCells();
    cells.forEach(cell => {
        cell.textContent = ' ';
        cell.style.removeProperty('background-color');
        cell.addEventListener('click',turnClick, false);
    });
}

function turnClick(clickEvent){
    if(typeof originalBoard[clickEvent.target.id] === 'number'){ // if board content of cell is a number (cell is blank)
        turn(clickEvent.target.id, humanPlayer); // wrapped in 'turnClick' because the 'turn' func can be called with human or AI player.
        if(!checkTie() && !winnerFound){ //if not tied, com takes a turn, with square id gotten from bestMove()
            turn(bestMove(), comPlayer);
        }
    }
}

function turn(clickedCellID, player){
    originalBoard[clickedCellID] = player;
    document.getElementById(clickedCellID).textContent = player;
    
    let gameWon = checkVictory(originalBoard, player);
    if(gameWon) {gameOver(gameWon);}
}

// board is 9 elems array [0,1,2,3,4,5,6,7,8] with 'X' or 'O' where players played.
function checkVictory(board, player){
    //find places on board that has been played.
    // let plays = board.reduce((accumulator, elem, index) => { //go through each elem of board
    //     (elem === player) ? accumulator.concat(index) : accumulator; //if elem = player, add index to accumulator, if not, return accumulator without adding anything.
    // },[]); //initialize accumulator to []
    let gameWon = null;

    for(let i=0; i<winCombos.length; i++){
        combo = winCombos[i];
        if(board[combo[0]]===board[combo[1]]
        && board[combo[1]]===board[combo[2]] //if match a winning combo,
        && board[combo[0]] !== /^[\d]$/){ //and content is not a digit (should be 'O' or 'X').

            winnerFound = true;
            gameWon = {index: i, player: player};
            break;
        }
    }
    return gameWon; //null if no winner, hash if someone win (with which combo and which player won)
}

function gameOver(gameWon){
    //highlight squares that are part of winning combo
    winCombos[gameWon.index].forEach(index => {
        document.getElementById(index).style.backgroundColor = 
            gameWon.player === humanPlayer ? "lightGreen" : "red"; //green if human, red if com
    });

    //disable clicking on any squares
    disableCells();

    message.textContent = gameWon.player + " wins!";
}

function emptySquares(){
    //get all elems with type 'number', which is empty
    return originalBoard.filter(square => typeof square === 'number');
}

function bestMove(){
    return emptySquares()[0]; //return first empty square
}

function checkTie(){
    if(emptySquares().length === 0 && !winnerFound){ //if no empty squares and no winner found
        disableCells();
        message.textContent = "IT'S A DRAW";
        return true;
    }
    return false;
}

