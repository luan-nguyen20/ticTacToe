const cells = Array.from(document.querySelectorAll('.cell'));
const message = document.querySelector('.message');
const restartBtn = document.querySelector('.restartBtn');

cells.forEach(cell => {
    cell.addEventListener('click',e => {
        play(e);
    });
});

restartBtn.addEventListener('click', restart);

let val = ' ';
function play(e){
    if(e.target.textContent === ' '){ // if cell is blank
        val === 'X' ? val = 'O' : val = 'X'; // alternate X and O
        e.target.textContent = val;
        checkVictory();
    }
} 

function checkVictory(){
    const winCombo = [[0,1,2],[3,4,5],[6,7,8], // 3 rows
                    [0,3,6],[1,4,7],[2,5,8], // 3 cols
                    [0,4,8],[2,4,6]]; // 2 diagonals

    winCombo.forEach(combo => {
        if(cells[combo[0]].textContent===cells[combo[1]].textContent 
            && cells[combo[1]].textContent===cells[combo[2]].textContent 
            && cells[combo[0]].textContent !== " "){
            message.textContent = "Player " + val + " wins!";
            cells.forEach(cell => {
                cell.classList.add("disabled");
            });
        }
    })
}

function restart(){
    val = ' ';
    message.textContent = ' ';
    cells.forEach(cell => {
        cell.textContent = ' ';
        cell.classList.remove("disabled");
    });
}