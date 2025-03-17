const minesGrid = document.getElementById('minesGrid');
const startGameButton = document.getElementById('startGameButton');
const cashoutButton = document.getElementById('cashoutButton');
const betAmountInput = document.getElementById('betAmount');
const minesCountInput = document.getElementById('minesCount');
const gameResult = document.getElementById('gameResult');
const currentProfit = document.getElementById('currentProfit');
const balanceAmount = document.getElementById('balanceAmount');

let balance = 100.00; // Suma inițială de bani
let mines = [];
let revealedCells = [];
let gameActive = false;
let currentMultiplier = 1.0; // Multiplicatorul curent

function initializeGame() {
    minesGrid.innerHTML = '';
    revealedCells = [];
    gameActive = true;
    gameResult.textContent = '';
    currentProfit.textContent = 'Current Profit: $0.00';
    currentMultiplier = 1.0;
    cashoutButton.disabled = false;

    const totalCells = 25;
    const minesCount = parseInt(minesCountInput.value);

    mines = Array(totalCells).fill(false);
    for (let i = 0; i < minesCount; i++) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * totalCells);
        } while (mines[randomIndex]);
        mines[randomIndex] = true;
    }

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('mine-cell');
        cell.addEventListener('click', () => revealCell(i));
        minesGrid.appendChild(cell);
    }
}

function revealCell(index) {
    if (!gameActive || revealedCells.includes(index)) return;

    const cell = minesGrid.children[index];
    revealedCells.push(index);

    if (mines[index]) {
        cell.classList.add('mine');
        gameActive = false;
        gameResult.textContent = 'You hit a mine! Game over.';
        balance -= parseFloat(betAmountInput.value);
        balanceAmount.textContent = balance.toFixed(2);
        cashoutButton.disabled = true;
    } else {
        cell.classList.add('safe');
        currentMultiplier += 0.2; // Crește multiplicatorul cu 0.2 pentru fiecare celulă sigură
        currentProfit.textContent = `Current Profit: $${(parseFloat(betAmountInput.value) * currentMultiplier).toFixed(2)}`;

        if (revealedCells.length === (25 - mines.length)) {
            gameActive = false;
            gameResult.textContent = 'You won!';
            balance += parseFloat(betAmountInput.value) * currentMultiplier;
            balanceAmount.textContent = balance.toFixed(2);
            cashoutButton.disabled = true;
        }
    }
}

function cashout() {
    if (!gameActive) return;

    gameActive = false;
    const profit = parseFloat(betAmountInput.value) * currentMultiplier;
    balance += profit;
    balanceAmount.textContent = balance.toFixed(2);
    gameResult.textContent = `You cashed out! Profit: $${profit.toFixed(2)}`;
    cashoutButton.disabled = true;
}

startGameButton.addEventListener('click', () => {
    if (parseFloat(betAmountInput.value) <= 0 || parseFloat(betAmountInput.value) > balance) {
        gameResult.textContent = "Invalid bet amount!";
        return;
    }
    initializeGame();
});

cashoutButton.addEventListener('click', cashout);

// Inițializare joc la încărcarea paginii
initializeGame();