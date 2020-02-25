const cells = Array.from(document.querySelectorAll('.cell'));

cells.forEach(cell => {
    cell.addEventListener('click',e => {
        play(e);
    });
});

let val = ' ';
function play(e){
    if(e.target.textContent === ' '){ // if cell is blank
        val === 'X' ? val = 'O' : val = 'X'; // alternate X and O
        e.target.textContent = val;
        checkVictory();
    }
} 

function checkVictory(){
    const winCombo = [[0,1,2],[3,4,5],[6,7,8],
                    [0,3,6],[1,4,7],[2,5,8],
                    [0,4,8],[2,4,6]];

    winCombo.forEach(combo => {
        if(cells[combo[0]].textContent===cells[combo[1]].textContent && cells[combo[1]].textContent===cells[combo[2]].textContent && cells[combo[0]].textContent !== " "){
            alert("Player " + val + " wins!");
        }
    })
}