// Animație pentru bara de progres
const progressBar = document.querySelector('.progress');
if (progressBar) {
    progressBar.style.width = '30%'; // Setează progresul inițial
}

// Actualizează statisticile din localStorage
const user = localStorage.getItem('user');
if (user) {
    const userData = JSON.parse(user);
    document.getElementById('games-played').textContent = userData.gamesPlayed;
    document.getElementById('total-wins').textContent = userData.totalWins;
    document.getElementById('win-rate').textContent = `${((userData.totalWins / userData.gamesPlayed) * 100).toFixed(2)}%`;
    document.getElementById('total-wagered').textContent = `$${userData.totalWagered.toFixed(2)}`;
}

window.addEventListener('load', () => {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        console.log('User data loaded:', userData);

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