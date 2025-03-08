// Verifică dacă utilizatorul este logat la încărcarea paginii
window.addEventListener('load', () => {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        updateMenu(userData.username);
    }
});

// Funcție pentru actualizarea meniului
function updateMenu(username) {
    const userMenuItem = document.getElementById('user-menu-item');
    const userNameSpan = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');

    if (username) {
        userNameSpan.textContent = username;
        userMenuItem.querySelector('a').href = '#';
        logoutBtn.style.visibility = 'visible'; // Afișează butonul de logout
    } else {
        userNameSpan.textContent = 'Login';
        userMenuItem.querySelector('a').href = 'login.html';
        logoutBtn.style.visibility = 'hidden'; // Ascunde butonul de logout
    }
}

// Logout
document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    updateMenu(null);
    window.location.href = 'index.html';
});

// Confetti la logare/înregistrare
function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// Logare
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        if (userData.username === username && userData.password === password) {
            triggerConfetti();
            alert('Login successful!');
            window.location.href = 'index.html';
        } else {
            alert('Username sau parolă incorectă!');
        }
    } else {
        alert('Utilizatorul nu există!');
    }
});

// Înregistrare
document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {
        username,
        email,
        password
    };

    localStorage.setItem('user', JSON.stringify(user));
    triggerConfetti();
    alert('Cont creat cu succes!');
    window.location.href = 'login.html';
});

// Lista de jocuri
const games = [
    { category: "originals", image: "dice.png", name: "Dice", link: "dice.html" },
    { category: "originals", image: "mines.png", name: "Mines", link: "mines.html" },
    { category: "originals", image: "plinko.png", name: "Plinko", link: "plinko.html" },
    { category: "originals", image: "crash.png", name: "Crash", link: "crash.html" },
    { category: "originals", image: "limbo.png", name: "Limbo", link: "limbo.html" },
    { category: "originals", image: "hilo.png", name: "Hilo", link: "hilo.html" },
    { category: "slots", image: "bass.png", name: "Bostafa", link: "bass.html" },
    { category: "slots", image: "dog.png", name: "Freesthe Fat", link: "dog.html" },
    { category: "slots", image: "olympus.png", name: "Ladies Delymns", link: "olympus.html" },
    { category: "slots", image: "bonzaza.png", name: "Produce Pay", link: "bonzaza.html" },
    { category: "slots", image: "avia.png", name: "Blood Lust", link: "avia.html" },
    { category: "slots", image: "wild.png", name: "Sugar Rush", link: "wild.html" },
    { category: "slots", image: "fruit.png", name: "Sugar Rush", link: "fruit.html" },  
    { category: "slots", image: "star.png", name: "Sugar Rush", link: "star.html" },
    { category: "slots", image: "gang.png", name: "Sugar Rush", link: "gang.html" },
    { category: "live", image: "blackjack.png", name: "Blackjack", link: "blackjack.html" },
    { category: "live", image: "roulette.png", name: "Roulette", link: "roulette.html" },
    { category: "live", image: "baccarat.png", name: "Baccarat", link: "baccarat.html" },
];

// Funcție pentru a genera un număr aleatoriu de jucători
function getRandomPlayers() {
    return Math.floor(Math.random() * 1200); // Generează un număr între 0 și 5422
}

// Funcție pentru a amesteca jocurile
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Funcție pentru a afișa jocurile
function displayGames(filter = "all") {
    const gameCardsContainer = document.querySelector('.game-cards');
    gameCardsContainer.innerHTML = ''; // Șterge jocurile existente

    const filteredGames = filter === "all" ? games : games.filter(game => game.category === filter);
    const shuffledGames = shuffleArray(filteredGames); // Amestecă jocurile

    shuffledGames.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');
        gameCard.setAttribute('data-category', game.category);

        const playersCount = getRandomPlayers(); // Generează un număr aleatoriu de jucători

        gameCard.innerHTML = `
            <a href="${game.link}">
                <img src="${game.image}" alt="${game.name}">
                <div class="players-count">${playersCount.toLocaleString()} playing</div>
            </a>
        `;

        gameCardsContainer.appendChild(gameCard);
    });
}

// Funcție pentru a gestiona filtrele
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Elimină clasa 'active' de la toate butoanele
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adaugă clasa 'active' la butonul apăsat
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');
            displayGames(filter); // Afișează jocurile filtrate
        });
    });
}

// Inițializare
window.addEventListener('load', () => {
    displayGames(); // Afișează toate jocurile la încărcarea paginii
    setupFilters(); // Configurează filtrele
});

// Verifică dacă utilizatorul este logat la încărcarea paginii
window.addEventListener('load', () => {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        updateMenu(userData.username);
        document.getElementById('balance-container').style.display = 'flex'; // Afișează chenarul de balanță
        updateBalance(); // Actualizează balanța
    }
});

// Funcție pentru actualizarea meniului
function updateMenu(username) {
    const userMenuItem = document.getElementById('user-menu-item');
    const userNameSpan = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');

    if (username) {
        userNameSpan.textContent = username;
        userMenuItem.querySelector('a').href = '#';
        logoutBtn.style.visibility = 'visible'; // Afișează butonul de logout
    } else {
        userNameSpan.textContent = 'Login';
        userMenuItem.querySelector('a').href = 'login.html';
        logoutBtn.style.visibility = 'hidden'; // Ascunde butonul de logout
        document.getElementById('balance-container').style.display = 'none'; // Ascunde chenarul de balanță
    }
}

// Funcție pentru actualizarea balanței
function updateBalance() {
    const balanceAmount = document.getElementById('balance-amount');
    // Aici poți adăuga logica pentru a obține balanța din backend sau localStorage
    balanceAmount.textContent = "0"; // Valoarea implicită (poate fi actualizată dinamic)
}

// Logout
document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    updateMenu(null);
    window.location.href = 'index.html';
});

// Deschide popup-ul de depozitare
document.getElementById('add-funds-btn')?.addEventListener('click', () => {
    document.getElementById('deposit-popup').style.display = 'flex';
});

// Închide popup-ul de depozitare
document.querySelector('.close-btn')?.addEventListener('click', () => {
    document.getElementById('deposit-popup').style.display = 'none';
});

// Gestionare metode de depozitare
document.querySelectorAll('.deposit-method').forEach(method => {
    method.addEventListener('click', () => {
        const methodName = method.querySelector('span').textContent;
        alert(`Ai ales să depozitezi folosind: ${methodName}`);
        document.getElementById('deposit-popup').style.display = 'none';
    });
});

// Toggle meniul pe mobile
document.getElementById('mobile-menu-button').addEventListener('click', () => {
    const menuContainer = document.querySelector('.menu-container');
    menuContainer.classList.toggle('active');
});