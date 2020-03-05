let originalBoard;
const humanPlayer = 'O';
const comPlayer = 'X';
const winCombos = [
	[0, 1, 2], [3, 4, 5], [6, 7, 8], //3 rows
	[0, 3, 6], [1, 4, 7], [2, 5, 8], //3 columns
	[0, 4, 8], [6, 4, 2] //2 diagonals
];

const cells = document.querySelectorAll('.cell');
const message = document.querySelector('.message');
const restartBtn = document.querySelector('.restartBtn');
restartBtn.addEventListener('click', startGame);

startGame();

function startGame() {
	message.textContent = "";
	originalBoard = Array.from(Array(9).keys()); //create array with 9 elems, values from 0-8.
	for (let i = 0; i < cells.length; i++) {
		cells[i].textContent = "";
        cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
	if (typeof originalBoard[square.target.id] == 'number') { // if board content of cell is a number (cell is blank)
		turn(square.target.id, humanPlayer); // wrapped in 'turnClick' because the 'turn' func can be called with human or AI player.
		if (!checkVictory(originalBoard, humanPlayer) && !checkTie()) { //if not tied and human didn't win, com takes a turn, with square id gotten from bestMove()
            turn(bestMove(), comPlayer);
        }
	}
}

function turn(squareId, player) {
	originalBoard[squareId] = player;
	document.getElementById(squareId).textContent = player;
	let gameWon = checkVictory(originalBoard, player);
	if (gameWon) {gameOver(gameWon);}
}

function checkVictory(board, player) {
    //find places on board that has been played.
    let plays = board.reduce((accumulator, elem, i) => //go through each elem of board
        //if elem = player, add index to accumulator, if not, return accumulator without adding anything.
		(elem === player) ? accumulator.concat(i) : accumulator, []); //initialized accumulator to []
    
    let gameWon = null;
	for (let [index, win] of winCombos.entries()) { // check if game has been won. winCombos.entries get both the index and element (a win combo)
		if (win.every(elem => plays.indexOf(elem) > -1)) { //go through every elems in a win combo, check if plays.indexOf(elem) > -1). //It means check if player has played in every spots in a win combo.
			gameWon = {index: index, player: player}; //if yes, get which player and which combo
			break; //break out of for loop
		}
	}
	return gameWon; //null or hash with which winner and which combo
}

function gameOver(gameWon) {
    //highlight squares that are part of winning combo
    winCombos[gameWon.index].forEach(index => {
        document.getElementById(index).style.backgroundColor = 
            gameWon.player === humanPlayer ? "lightGreen" : "red"; //green if human, red if com
    });

    //disable clicking on squares
	for (let i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
    }
    
	declareWinner(gameWon.player == humanPlayer ? "YOU WIN !" : "YOU LOSE !");
}

function declareWinner(who) {
	message.textContent = who;
}

function emptySquares() {
	return originalBoard.filter(cell => typeof cell == 'number'); //get all elems with type 'number' from originalBoard, which means empty cells
}

function bestMove() {
	return minimax(originalBoard, comPlayer).index; //return result of minimax .index because minimax return an object, .index is the index the AI will play
}

function checkTie() {
	if (emptySquares().length == 0) { // if no empty squares
		for (let i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "lightBlue";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("TIE !")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	let availCells = emptySquares();

    //check for tereminal states
	if (checkVictory(newBoard, humanPlayer)) { //human wins
		return {score: -10}; //low score
	} else if (checkVictory(newBoard, comPlayer)) { //COM wins
		return {score: 10}; //high score
	} else if (availCells.length === 0) { //draw
		return {score: 0}; //0 score
    }
    
    //collect scores from each empty squares to evaluate
	let moves = [];
	for (let i = 0; i < availCells.length; i++) {
		let move = {};
		move.index = newBoard[availCells[i]];
		newBoard[availCells[i]] = player;

		if (player === comPlayer) {
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, comPlayer);
			move.score = result.score;
		}

		newBoard[availCells[i]] = move.index; //reset newBoard to what it was before

		moves.push(move); // push move object to moves arr
	}

	let bestMove; //evaluate bestMove in moves arr
	if(player === comPlayer) { //choose move with highest score when AI is playing
		let bestScore = -Infinity;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else { //choose move with lowest score when human is playing
		var bestScore = Infinity;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}