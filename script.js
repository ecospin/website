// Variabile globale
const initialUserData = {
    balance: 100.00,
    totalWagered: 0.00,
    totalWins: 0,
    profitLoss: 0.00,
    gamesPlayed: 0,
    gameHistory: []
};

let userData = JSON.parse(localStorage.getItem('userData')) || initialUserData;

// Funcții
function saveUserData(data) {
    localStorage.setItem('userData', JSON.stringify(data));
}

function loadUserData() {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : initialUserData;
}

function updateMenu(username) {
    const userMenuItem = document.getElementById('user-menu-item');
    const userNameSpan = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const accountLink = document.getElementById('account-link');

    if (username) {
        userNameSpan.textContent = username;
        accountLink.href = 'account.html';
        logoutBtn.style.visibility = 'visible';
    } else {
        userNameSpan.textContent = 'Login';
        accountLink.href = 'login.html';
        logoutBtn.style.visibility = 'hidden';
    }
}

function updateBalance() {
    const balanceAmount = document.getElementById('balance-amount');
    balanceAmount.textContent = userData.balance.toFixed(2);
}

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

// Logout
document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    updateMenu(null);
    window.location.href = 'index.html';
});

// Jocuri
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

function getRandomPlayers() {
    return Math.floor(Math.random() * 1200);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayGames(filter = "all") {
    const gameCardsContainer = document.querySelector('.game-cards');
    gameCardsContainer.innerHTML = '';

    const filteredGames = filter === "all" ? games : games.filter(game => game.category === filter);
    const shuffledGames = shuffleArray(filteredGames);

    shuffledGames.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');
        gameCard.setAttribute('data-category', game.category);

        const playersCount = getRandomPlayers();

        gameCard.innerHTML = `
            <a href="${game.link}">
                <img src="${game.image}" alt="${game.name}">
                <div class="players-count">${playersCount.toLocaleString()} playing</div>
            </a>
        `;

        gameCardsContainer.appendChild(gameCard);
    });
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');
            displayGames(filter);
        });
    });
}

// Inițializare
window.addEventListener('load', () => {
    displayGames();
    setupFilters();

    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        updateMenu(userData.username);
        document.getElementById('balance-container').style.display = 'flex';
        updateBalance();
    }

    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
});

// Funcționalitate pentru popup-ul de autentificare
const authPopup = document.getElementById('auth-popup');
const authTitle = document.getElementById('auth-title');
const authForm = document.getElementById('auth-form');
const authSwitchText = document.getElementById('auth-switch-text');
const authSwitchLink = document.getElementById('auth-switch-link');
const authEmail = document.getElementById('auth-email');
const authSubmit = document.getElementById('auth-submit');
const closeBtn = document.querySelector('.close-btn');

let isLogin = true;

// Deschide popup-ul când se apasă pe "Login"
document.getElementById('user-menu-item').addEventListener('click', (e) => {
    e.preventDefault();
    authPopup.style.display = 'flex';
});

// Închide popup-ul când se apasă pe butonul de închidere
closeBtn.addEventListener('click', () => {
    authPopup.style.display = 'none';
});

// Schimbă între login și register
authSwitchLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    if (isLogin) {
        authTitle.textContent = 'Login';
        authSubmit.textContent = 'Login';
        authSwitchText.innerHTML = 'Don\'t have an account? <a href="#" id="auth-switch-link">Register here</a>.';
        authEmail.style.display = 'none';
    } else {
        authTitle.textContent = 'Register';
        authSubmit.textContent = 'Register';
        authSwitchText.innerHTML = 'Already have an account? <a href="#" id="auth-switch-link">Login here</a>.';
        authEmail.style.display = 'block';
    }
});

// Gestionează trimiterea formularului
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('auth-username').value;
    const password = document.getElementById('auth-password').value;
    const email = isLogin ? null : document.getElementById('email').value;

    if (isLogin) {
        // Logica pentru login
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            if (userData.username === username && userData.password === password) {
                alert('Login successful!');
                updateMenu(username);
                authPopup.style.display = 'none';
                document.getElementById('balance-container').style.display = 'flex';
                updateBalance();
            } else {
                alert('Incorrect username or password!');
            }
        } else {
            alert('User does not exist!');
        }
    } else {
        // Logica pentru register
        const user = {
            username,
            email,
            password
        };
        localStorage.setItem('user', JSON.stringify(user));
        alert('Account created successfully!');
        isLogin = true;
        authTitle.textContent = 'Login';
        authSubmit.textContent = 'Login';
        authSwitchText.innerHTML = 'Don\'t have an account? <a href="#" id="auth-switch-link">Register here</a>.';
        authEmail.style.display = 'none';
    }
});

// Actualizează balanța în localStorage
function updateBalanceInStorage(newBalance) {
    const userData = JSON.parse(localStorage.getItem('userData')) || initialUserData;
    userData.balance = newBalance;
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Încarcă balanța pe fiecare pagină
function loadBalance() {
    const userData = JSON.parse(localStorage.getItem('userData')) || initialUserData;
    const balanceAmount = document.getElementById('balance-amount');
    if (balanceAmount) {
        balanceAmount.textContent = userData.balance.toFixed(2);
    }
}

// Inițializare balanță la încărcarea paginii
window.addEventListener('load', () => {
    loadBalance();
});

function updateMenu(username) {
    const userMenuItem = document.getElementById('user-menu-item');
    const userNameSpan = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const accountLink = document.getElementById('account-link');

    if (username) {
        userNameSpan.textContent = username;
        accountLink.href = 'account.html'; // Redirecționează către account.html
        logoutBtn.style.visibility = 'visible';
    } else {
        userNameSpan.textContent = 'Login';
        accountLink.href = 'login.html';
        logoutBtn.style.visibility = 'hidden';
    }
}

document.getElementById('user-menu-item').addEventListener('click', (e) => {
    const user = localStorage.getItem('user');
    if (user) {
        e.preventDefault(); // Împiedică comportamentul implicit al linkului
        window.location.href = 'account.html'; // Redirecționează către account.html
    }
});

// Încarcă detaliile contului pe pagina account.html
if (window.location.pathname.includes('account.html')) {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        document.getElementById('account-username').textContent = userData.username;
        document.getElementById('account-email').textContent = userData.email;
        document.getElementById('account-balance').textContent = userData.balance.toFixed(2);
    } else {
        // Dacă utilizatorul nu este logat, redirecționează către login
        window.location.href = 'login.html';
    }
}

// Funcție pentru a actualiza datele utilizatorului după un joc
function updateUserDataAfterGame(gameName, result, amount) {
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        totalWagered: 0,
        totalWins: 0,
        profitLoss: 0,
        gamesPlayed: 0,
        gameHistory: []
    };

    userData.totalWagered += amount;
    userData.gamesPlayed += 1;

    if (result === 'win') {
        userData.totalWins += 1;
        userData.profitLoss += amount;
    } else {
        userData.profitLoss -= amount;
    }

    // Adaugă jocul în istoric
    userData.gameHistory.push({
        game: gameName,
        result: result,
        amount: `$${amount.toFixed(2)}`,
        date: new Date().toLocaleString()
    });

    // Salvează datele actualizate în localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Deschide popup-ul când se apasă pe butonul "+"
document.getElementById('add-funds-btn')?.addEventListener('click', () => {
    const depositPopup = document.getElementById('deposit-popup');
    if (depositPopup) {
        depositPopup.style.display = 'flex';
    }
});

// Închide popup-ul când se apasă pe butonul de închidere
document.querySelector('.close-btn')?.addEventListener('click', () => {
    const depositPopup = document.getElementById('deposit-popup');
    if (depositPopup) {
        depositPopup.style.display = 'none';
    }
});

// Închide popup-ul când se apasă în afara conținutului
window.addEventListener('click', (e) => {
    const depositPopup = document.getElementById('deposit-popup');
    if (e.target === depositPopup) {
        depositPopup.style.display = 'none';
    }
});

window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500); // Ascunde loading screen-ul după ce opacitatea devine 0
    }, 2000); // Așteaptă 2 secunde înainte de a începe să ascundă loading screen-ul
});

// Filtrare promoții
const promoFilterButtons = document.querySelectorAll('.promo-filters .filter-btn');
const promoCards = document.querySelectorAll('.promo-card');

promoFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Elimină clasa "active" de la toate butoanele
        promoFilterButtons.forEach(btn => btn.classList.remove('active'));
        // Adaugă clasa "active" la butonul apăsat
        button.classList.add('active');

        // Filtrează card-urile
        const filter = button.getAttribute('data-filter');
        promoCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Buton de "Claim"
const claimButtons = document.querySelectorAll('.claim-btn');
claimButtons.forEach(button => {
    button.addEventListener('click', () => {
        alert('Promotion claimed successfully!');
    });
});

const sections = document.querySelectorAll('section');

const checkVisibility = () => {
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            section.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', checkVisibility);
window.addEventListener('load', checkVisibility); 

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
    const balanceAmount = document.getElementById('balance-amount');
    if (balanceAmount) {
        balanceAmount.textContent = newBalance.toFixed(2);
    }
}

// Funcție pentru a verifica dacă utilizatorul este logat
function checkLogin() {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        console.log('User data loaded:', userData); // Verifică în consolă

        // Actualizează numele utilizatorului în header
        const userNameSpan = document.getElementById('user-name');
        if (userNameSpan) {
            userNameSpan.textContent = userData.username;
        }

        // Actualizează balanța în header
        const balanceAmount = document.getElementById('balance-amount');
        if (balanceAmount) {
            balanceAmount.textContent = userData.balance.toFixed(2);
        }

        // Afișează chenarul cu balanța și butonul de logout
        const balanceContainer = document.getElementById('balance-container');
        if (balanceContainer) {
            balanceContainer.style.display = 'flex';
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.style.visibility = 'visible';
        }
    } else {
        // Dacă utilizatorul nu este logat, redirecționează către login
        window.location.href = 'login.html';
    }
}

// Verifică starea de autentificare la încărcarea paginii
window.addEventListener('load', checkLogin);

// Logout
document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

// Verifică dacă utilizatorul este logat
function checkLogin() {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        console.log('User data loaded:', userData); // Verifică în consolă

        // Actualizează numele utilizatorului în header
        const userNameSpan = document.getElementById('user-name');
        if (userNameSpan) {
            userNameSpan.textContent = userData.username;
        }

        // Actualizează balanța în header
        const balanceAmount = document.getElementById('balance-amount');
        if (balanceAmount) {
            balanceAmount.textContent = userData.balance.toFixed(2);
        }

        // Afișează chenarul cu balanța și butonul de logout
        const balanceContainer = document.getElementById('balance-container');
        if (balanceContainer) {
            balanceContainer.style.display = 'flex';
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.style.visibility = 'visible';
        }
    } else {
        // Dacă utilizatorul nu este logat, redirecționează către login
        window.location.href = 'login.html';
    }
}

// Verifică starea de autentificare la încărcarea paginii
window.addEventListener('load', checkLogin);

// Logout
document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});