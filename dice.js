const betAmountInput = document.getElementById('betAmount');
const multiplierInput = document.getElementById('multiplier');
const rollOverInput = document.getElementById('rollOver');
const winChanceDisplay = document.getElementById('winChance');
const rollButton = document.getElementById('rollButton');
const resultText = document.getElementById('resultText');
const rollIndicator = document.getElementById('rollIndicator');
const winZone = document.querySelector('.win-zone');
const toggleRollOverButton = document.getElementById('toggleRollOver');
const balanceAmount = document.getElementById('balanceAmount');

let isRollOver = true; // true = peste, false = sub
let balance = 100.00; // Suma inițială de bani

function calculateWinChanceAndMultiplier() {
    const rollOver = parseFloat(rollOverInput.value);
    const winChance = (isRollOver ? 100 - rollOver : rollOver).toFixed(4);
    winChanceDisplay.textContent = `${winChance}%`;

    const multiplier = (100 / winChance).toFixed(4);
    multiplierInput.value = multiplier;

    if (isRollOver) {
        winZone.style.left = `${rollOver}%`;
        winZone.style.width = `${100 - rollOver}%`;
    } else {
        winZone.style.left = `0%`;
        winZone.style.width = `${rollOver}%`;
    }
}

rollOverInput.addEventListener('input', () => {
    calculateWinChanceAndMultiplier();
});

toggleRollOverButton.addEventListener('click', () => {
    isRollOver = !isRollOver;
    toggleRollOverButton.textContent = isRollOver ? "Roll Over" : "Roll Under";
    calculateWinChanceAndMultiplier();
});

rollButton.addEventListener('click', () => {
    const betAmount = parseFloat(betAmountInput.value);
    const multiplier = parseFloat(multiplierInput.value);
    const rollOver = parseFloat(rollOverInput.value);

    if (betAmount <= 0 || betAmount > balance) {
        resultText.textContent = "Please enter a valid bet amount!";
        return;
    }

    const randomNumber = Math.random() * 100;
    rollIndicator.style.left = `${randomNumber}%`;

    if ((isRollOver && randomNumber > rollOver) || (!isRollOver && randomNumber < rollOver)) {
        const winAmount = (betAmount * multiplier).toFixed(2);
        balance += parseFloat(winAmount);
        balanceAmount.textContent = balance.toFixed(2);
        resultText.textContent = `You win! Amount: $${winAmount}`;
        resultText.classList.add('win');
        setTimeout(() => resultText.classList.remove('win'), 500);
    } else {
        balance -= betAmount;
        balanceAmount.textContent = balance.toFixed(2);
        resultText.textContent = "You lose! Try again.";
        resultText.classList.add('lose');
        setTimeout(() => resultText.classList.remove('lose'), 500);
    }
});

calculateWinChanceAndMultiplier();