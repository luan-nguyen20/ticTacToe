const cells = Array.from(document.querySelectorAll('.cell'));

cells.forEach(cell => {
    cell.addEventListener('click',e => {
        play(e);
    });
});

let val = ' ';
function play(e){
    if(e.target.textContent == ' '){ // if cell is blank
        val == 'X' ? val = 'O' : val = 'X'; // alternate X and O
        e.target.textContent = val;
    }
} 