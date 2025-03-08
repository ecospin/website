const startGameButton = document.getElementById('startGameButton');
const betAmountInput = document.getElementById('betAmount');
const targetMultiplierInput = document.getElementById('targetMultiplier');
const gameResult = document.getElementById('gameResult');
const currentProfit = document.getElementById('currentProfit');
const lastResult = document.getElementById('lastResult');
const generatedNumber = document.getElementById('generatedNumber');
const balanceAmount = document.getElementById('balanceAmount');

let balance = 100.00; // Suma inițială de bani

function startGame() {
    const betAmount = parseFloat(betAmountInput.value);
    const targetMultiplier = parseFloat(targetMultiplierInput.value);

    if (betAmount <= 0 || betAmount > balance) {
        gameResult.textContent = "Invalid bet amount!";
        return;
    }

    if (targetMultiplier < 1) {
        gameResult.textContent = "Target multiplier must be at least 1!";
        return;
    }

    // Generează un număr aleatoriu între 1 și 1000000
    const randomNumber = Math.floor(Math.random() * 1000000) + 1;
    const generatedMultiplier = (1000000 / randomNumber).toFixed(2);

    generatedNumber.textContent = generatedMultiplier;

    if (generatedMultiplier >= targetMultiplier) {
        // Jucătorul câștigă
        const profit = betAmount * targetMultiplier;
        balance += profit;
        gameResult.textContent = `You won! Profit: $${profit.toFixed(2)}`;
        lastResult.textContent = "Win";
    } else {
        // Jucătorul pierde
        balance -= betAmount;
        gameResult.textContent = "You lost!";
        lastResult.textContent = "Lose";
    }

    balanceAmount.textContent = balance.toFixed(2);
    currentProfit.textContent = `Current Profit: $${(balance - 100).toFixed(2)}`;
}

startGameButton.addEventListener('click', startGame);