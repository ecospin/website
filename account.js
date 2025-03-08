// Verifică dacă utilizatorul este logat
const user = localStorage.getItem('user');
if (!user) {
    // Dacă utilizatorul nu este logat, redirecționează către login
    window.location.href = 'login.html';
} else {
    // Încarcă datele utilizatorului
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        totalWagered: 0,
        totalWins: 0,
        profitLoss: 0,
        gamesPlayed: 0,
        gameHistory: []
    };

    // Actualizează statisticile
    document.getElementById('total-wagered').textContent = `$${userData.totalWagered.toFixed(2)}`;
    document.getElementById('total-wins').textContent = userData.totalWins;
    document.getElementById('profit-loss').textContent = `$${userData.profitLoss.toFixed(2)}`;
    document.getElementById('games-played').textContent = userData.gamesPlayed;

    // Actualizează istoricul jocurilor
    const gameHistoryBody = document.getElementById('game-history-body');
    if (gameHistoryBody) {
        userData.gameHistory.forEach(game => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${game.game}</td>
                <td>${game.result}</td>
                <td>${game.amount}</td>
                <td>${game.date}</td>
            `;
            gameHistoryBody.appendChild(row);
        });
    }
}