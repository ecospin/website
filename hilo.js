const currentCard = document.getElementById('currentCard');
const nextCard = document.getElementById('nextCard');
const startGameButton = document.getElementById('startGameButton');
const cashoutButton = document.getElementById('cashoutButton');
const higherButton = document.getElementById('higherButton');
const lowerButton = document.getElementById('lowerButton');
const equalButton = document.getElementById('equalButton');
const betAmountInput = document.getElementById('betAmount');
const gameResult = document.getElementById('gameResult');
const currentProfit = document.getElementById('currentProfit');
const chancesDisplay = document.getElementById('chances');
const balanceAmount = document.getElementById('balanceAmount');

let balance = 100.00; // Suma inițială de bani
let currentMultiplier = 1.0; // Multiplicatorul curent
let gameActive = false;
let currentValue = 0;
let nextValue = 0;

function getRandomCard() {
    return Math.floor(Math.random() * 13) + 1; // Cărți de la 1 (A) la 13 (K)
}

function calculateChances(currentValue) {
    const totalCards = 13;
    let higherChance = 0;
    let lowerChance = 0;
    let equalChance = 0;

    if (currentValue === 1) {
        higherChance = (totalCards - 1) / totalCards; // Nu există carte mai mică decât 1
        equalChance = 1 / totalCards;
    } else if (currentValue === 13) {
        lowerChance = (totalCards - 1) / totalCards; // Nu există carte mai mare decât 13
        equalChance = 1 / totalCards;
    } else {
        higherChance = (13 - currentValue) / totalCards;
        lowerChance = (currentValue - 1) / totalCards;
        equalChance = 1 / totalCards;
    }

    return {
        higher: higherChance,
        lower: lowerChance,
        equal: equalChance
    };
}

function updateChancesDisplay(chances) {
    chancesDisplay.textContent = `Chances: Higher (${(chances.higher * 100).toFixed(2)}%) | Lower (${(chances.lower * 100).toFixed(2)}%) | Equal (${(chances.equal * 100).toFixed(2)}%)`;
}

function startGame() {
    if (parseFloat(betAmountInput.value) <= 0 || parseFloat(betAmountInput.value) > balance) {
        gameResult.textContent = "Invalid bet amount!";
        return;
    }

    gameActive = true;
    currentMultiplier = 1.0;
    currentProfit.textContent = 'Current Profit: $0.00';
    cashoutButton.disabled = false;

    currentValue = getRandomCard();
    currentCard.textContent = currentValue;
    nextCard.textContent = '?';
    gameResult.textContent = 'Guess the next card!';

    const chances = calculateChances(currentValue);
    updateChancesDisplay(chances);
}

function guessCard(guess) {
    if (!gameActive) return;

    nextValue = getRandomCard();
    nextCard.textContent = nextValue;

    const chances = calculateChances(currentValue);
    let rewardMultiplier = 1.0;

    if (
        (guess === 'higher' && nextValue > currentValue) ||
        (guess === 'lower' && nextValue < currentValue) ||
        (guess === 'equal' && nextValue === currentValue)
    ) {
        // Ajustăm rewardul în funcție de șanse
        if (guess === 'higher') rewardMultiplier = 1 / chances.higher;
        else if (guess === 'lower') rewardMultiplier = 1 / chances.lower;
        else if (guess === 'equal') rewardMultiplier = 1 / chances.equal;

        currentMultiplier += rewardMultiplier * 0.1; // Crește multiplicatorul în funcție de șanse
        currentProfit.textContent = `Current Profit: $${(parseFloat(betAmountInput.value) * currentMultiplier).toFixed(2)}`;
        currentValue = nextValue;
        currentCard.textContent = currentValue;
        nextCard.textContent = '?';

        const newChances = calculateChances(currentValue);
        updateChancesDisplay(newChances);
    } else {
        gameActive = false;
        gameResult.textContent = 'You lost!';
        balance -= parseFloat(betAmountInput.value);
        balanceAmount.textContent = balance.toFixed(2);
        cashoutButton.disabled = true;
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

startGameButton.addEventListener('click', startGame);
cashoutButton.addEventListener('click', cashout);
higherButton.addEventListener('click', () => guessCard('higher'));
lowerButton.addEventListener('click', () => guessCard('lower'));
equalButton.addEventListener('click', () => guessCard('equal'));

const higherChanceDisplay = document.getElementById('higherChance');
const lowerChanceDisplay = document.getElementById('lowerChance');
const equalChanceDisplay = document.getElementById('equalChance');

function updateChancesDisplay(chances) {
    higherChanceDisplay.textContent = `Higher: ${(chances.higher * 100).toFixed(2)}%`;
    lowerChanceDisplay.textContent = `Lower: ${(chances.lower * 100).toFixed(2)}%`;
    equalChanceDisplay.textContent = `Equal: ${(chances.equal * 100).toFixed(2)}%`;
}

function guessCard(guess) {
    if (!gameActive) return;

    nextValue = getRandomCard();
    nextCard.textContent = nextValue;

    const chances = calculateChances(currentValue);
    let rewardMultiplier = 1.0;

    if (
        (guess === 'higher' && nextValue > currentValue) ||
        (guess === 'lower' && nextValue < currentValue) ||
        (guess === 'equal' && nextValue === currentValue)
    ) {
        // Ajustăm rewardul în funcție de șanse
        if (guess === 'higher') rewardMultiplier = 1 / chances.higher;
        else if (guess === 'lower') rewardMultiplier = 1 / chances.lower;
        else if (guess === 'equal') rewardMultiplier = 1 / chances.equal;

        currentMultiplier += rewardMultiplier * 0.1; // Crește multiplicatorul în funcție de șanse
        currentProfit.textContent = `Current Profit: $${(parseFloat(betAmountInput.value) * currentMultiplier).toFixed(2)}`;
        currentValue = nextValue;
        currentCard.textContent = currentValue;
        nextCard.textContent = '?';

        const newChances = calculateChances(currentValue);
        updateChancesDisplay(newChances);
    } else {
        // Jucătorul a pierdut
        gameActive = false;
        gameResult.textContent = 'You lost!';
        balance -= parseFloat(betAmountInput.value);
        balanceAmount.textContent = balance.toFixed(2);
        cashoutButton.disabled = true;

        // Aplicăm animația de explozie
        nextCard.classList.add('explode');
        setTimeout(() => {
            nextCard.classList.remove('explode');
        }, 500); // Durata animației
    }
}