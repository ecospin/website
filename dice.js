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

// Verifică dacă utilizatorul este logat la încărcarea paginii
window.addEventListener('load', () => {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        console.log('User data loaded:', userData); // Verifică în consolă

        // Actualizează balanța afișată
        updateBalance(userData.balance);

        // Afișează chenarul cu balanța în header
        const balanceContainer = document.getElementById('balance-container');
        if (balanceContainer) {
            balanceContainer.style.display = 'flex';
        }

        // Afișează butonul de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.style.visibility = 'visible';
        }

        // Actualizează numele utilizatorului în header
        const userNameSpan = document.getElementById('user-name');
        if (userNameSpan) {
            userNameSpan.textContent = userData.username;
        }
    } else {
        // Dacă utilizatorul nu este logat, redirecționează către login
        window.location.href = 'login.html';
    }
});

// Funcție pentru actualizarea balanței afișate
function updateBalance(newBalance) {
    // Actualizează balanța în joc
    const balanceAmount = document.getElementById('balanceAmount');
    if (balanceAmount) {
        balanceAmount.textContent = newBalance.toFixed(2);
    }

    // Actualizează balanța în header
    const headerBalance = document.getElementById('balance-amount');
    if (headerBalance) {
        headerBalance.textContent = newBalance.toFixed(2);
    }
}

// Funcție pentru a calcula șansa de câștig și multiplicatorul
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

// Ascultă modificări în câmpul Roll Over
rollOverInput.addEventListener('input', () => {
    calculateWinChanceAndMultiplier();
});

// Schimbă între "Roll Over" și "Roll Under"
toggleRollOverButton.addEventListener('click', () => {
    isRollOver = !isRollOver;
    toggleRollOverButton.textContent = isRollOver ? "Roll Over" : "Roll Under";
    calculateWinChanceAndMultiplier();
});

// Ascultă evenimentul de click pe butonul Roll Dice
rollButton.addEventListener('click', () => {
    const betAmount = parseFloat(betAmountInput.value);
    const multiplier = parseFloat(multiplierInput.value);
    const rollOver = parseFloat(rollOverInput.value);

    const user = localStorage.getItem('user');
    if (!user) {
        resultText.textContent = "You must be logged in to play!";
        window.location.href = 'login.html'; // Redirecționează către login
        return;
    }

    const userData = JSON.parse(user);
    if (betAmount <= 0 || betAmount > userData.balance) {
        resultText.textContent = "Please enter a valid bet amount!";
        return;
    }

    const randomNumber = Math.random() * 100;
    rollIndicator.style.left = `${randomNumber}%`;

    if ((isRollOver && randomNumber > rollOver) || (!isRollOver && randomNumber < rollOver)) {
        const winAmount = (betAmount * multiplier).toFixed(2);
        userData.balance += parseFloat(winAmount);
        resultText.textContent = `You win! Amount: $${winAmount}`;
        resultText.classList.add('win');
        setTimeout(() => resultText.classList.remove('win'), 500);
    } else {
        userData.balance -= betAmount;
        resultText.textContent = "You lose! Try again.";
        resultText.classList.add('lose');
        setTimeout(() => resultText.classList.remove('lose'), 500);
    }

    // Actualizează balanța în localStorage și pe ecran
    localStorage.setItem('user', JSON.stringify(userData));
    updateBalance(userData.balance);
});

// Logout
document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

// Inițializează șansa de câștig și multiplicatorul la încărcarea paginii
calculateWinChanceAndMultiplier();