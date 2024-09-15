const grid = document.getElementById("grid");
let lockGame = false;
const testMode = false; // Set to true if you want to test the mine locations

generateGrid();

// Function to generate a 10x10 grid
function generateGrid() {
    lockGame = false;
    grid.innerHTML = "";  // Clear any existing grid
    for (let i = 0; i < 10; i++) {
        let row = grid.insertRow(i);  // Create new row
        for (let j = 0; j < 10; j++) {
            let cell = row.insertCell(j);  // Insert cell into row
            cell.onclick = function() { init(this); };
            cell.setAttribute("mine", "false");  // Initialize 'mine' attribute
        }
    }
    generateMines();  // Randomly generate mines
}

// Function to randomly generate mines in the grid
function generateMines() {
    for (let i = 0; i < 20; i++) {  // 20 mines
        let row = Math.floor(Math.random() * 10);
        let col = Math.floor(Math.random() * 10);
        let cell = grid.rows[row].cells[col];
        cell.setAttribute("mine", "true");  // Mark the cell as a mine
        if (testMode) {
            cell.innerHTML = "X";  // Show mine locations in test mode
        }
    }
}

// Function to reveal all mines once the game is lost
function revealMines() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let cell = grid.rows[i].cells[j];
            if (cell.getAttribute("mine") === "true") {
                cell.classList.add("clicked");  // Add 'clicked' class for mines
            }
        }
    }
}

// Function to check if the game is complete
function checkGameComplete() {
    let gameComplete = true;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if ((grid.rows[i].cells[j].getAttribute("mine") === "false") &&
                (grid.rows[i].cells[j].innerHTML === "")) {
                gameComplete = false;
            }
        }
    }
    if (gameComplete) {
        document.getElementById("status").innerHTML = "You found all the mines!";
        revealMines();
    }
}

// Function to handle the click on a cell
function init(cell) {
    if (lockGame) return;  // Stop the game if it's locked
    if (cell.getAttribute("mine") === "true") {  // If a mine is clicked
        cell.classList.add("clicked");  // Add the 'clicked' class
        revealMines();  // Show all mines
        lockGame = true;  // Lock the game
        document.getElementById("status").innerHTML = "Game Over!";
    } else {
        cell.className = "active";  // Mark cell as active (clicked)
        let mineCount = 0;
        const cellRow = cell.parentNode.rowIndex;
        const cellCol = cell.cellIndex;
        // Check neighboring cells for mines
        for (let i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
            for (let j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) {
                if (grid.rows[i].cells[j].getAttribute("mine") === "true") {
                    mineCount++;
                }
            }
        }
        cell.innerHTML = mineCount;  // Show the number of nearby mines
        if (mineCount === 0) {
            const stack = [cell];  // Use a stack for iterative approach
            while (stack.length > 0) {
                const current = stack.pop();
                const row = current.parentNode.rowIndex;
                const col = current.cellIndex;
                for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, 9); i++) {
                    for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, 9); j++) {
                        const neighbor = grid.rows[i].cells[j];
                        if (neighbor.innerHTML === "" && neighbor.className !== "active") {
                            let count = 0;
                            for (let x = Math.max(i - 1, 0); x <= Math.min(i + 1, 9); x++) {
                                for (let y = Math.max(j - 1, 0); y <= Math.min(j + 1, 9); y++) {
                                    if (grid.rows[x].cells[y].getAttribute("mine") === "true") {
                                        count++;
                                    }
                                }
                            }
                            neighbor.innerHTML = count;
                            if (count === 0) {
                                stack.push(neighbor);
                            }
                        }
                    }
                }
            }
        }
        checkGameComplete();  // Check if the game is won
    }
}

// Reset game button
document.getElementById("reset-button").onclick = function() {
    generateGrid();
    document.getElementById("status").innerHTML = "";
};