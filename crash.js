const crashGraph = document.getElementById('crashGraph');
const crashLine = document.getElementById('crashLine');
const startGameButton = document.getElementById('startGameButton');
const cashoutButton = document.getElementById('cashoutButton');
const autoCashoutButton = document.getElementById('autoCashoutButton');
const autoCashoutValue = document.getElementById('autoCashoutValue');
const betAmountInput = document.getElementById('betAmount');
const gameResult = document.getElementById('gameResult');
const currentMultiplierDisplay = document.getElementById('currentMultiplier');
const balanceAmount = document.getElementById('balanceAmount');

let balance = 100.00; // Suma inițială de bani
let gameActive = false;
let currentMultiplier = 1.0;
let autoCashoutMultiplier = null;

function startGame() {
    if (parseFloat(betAmountInput.value) <= 0 || parseFloat(betAmountInput.value) > balance) {
        gameResult.textContent = "Invalid bet amount!";
        return;
    }

    gameActive = true;
    currentMultiplier = 1.0;
    currentMultiplierDisplay.textContent = `Multiplier: ${currentMultiplier.toFixed(2)}x`;
    cashoutButton.disabled = false;
    gameResult.textContent = '';

    // Simulăm creșterea multiplicatorului
    const crashPoint = Math.random() * 10 + 1; // Punctul de prăbușire (între 1x și 11x)
    const interval = setInterval(() => {
        if (!gameActive) {
            clearInterval(interval);
            return;
        }

        currentMultiplier += 0.01;
        currentMultiplierDisplay.textContent = `Multiplier: ${currentMultiplier.toFixed(2)}x`;

        // Verificăm dacă jocul s-a prăbușit
        if (currentMultiplier >= crashPoint) {
            gameActive = false;
            gameResult.textContent = 'Crashed!';
            balance -= parseFloat(betAmountInput.value);
            balanceAmount.textContent = balance.toFixed(2);
            crashLine.classList.add('explode');
            setTimeout(() => crashLine.classList.remove('explode'), 500);
            clearInterval(interval);
        }

        // Verificăm dacă jucătorul a setat auto-cashout
        if (autoCashoutMultiplier && currentMultiplier >= autoCashoutMultiplier) {
            cashout();
            clearInterval(interval);
        }
    }, 50);
}

function cashout() {
    if (!gameActive) return;

    gameActive = false;
    const profit = parseFloat(betAmountInput.value) * currentMultiplier;
    balance += profit;
    balanceAmount.textContent = balance.toFixed(2);
    gameResult.textContent = `You cashed out at ${currentMultiplier.toFixed(2)}x! Profit: $${profit.toFixed(2)}`;
    cashoutButton.disabled = true;

    // Efect de confetti pentru câștig
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random()}s`;
        crashGraph.appendChild(confetti);
        setTimeout(() => confetti.remove(), 2000);
    }
}

startGameButton.addEventListener('click', startGame);
cashoutButton.addEventListener('click', cashout);
autoCashoutButton.addEventListener('click', () => {
    autoCashoutMultiplier = parseFloat(autoCashoutValue.value);
    if (autoCashoutMultiplier) {
        gameResult.textContent = `Auto Cashout set at ${autoCashoutMultiplier}x`;
    }
});