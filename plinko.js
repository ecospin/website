const canvas = document.getElementById('plinkoCanvas');
const ctx = canvas.getContext('2d');
const dropBallButton = document.getElementById('dropBallButton');
const scoreDisplay = document.getElementById('scoreDisplay');
const betAmountInput = document.getElementById('betAmount');
const riskLevelSelect = document.getElementById('riskLevel');
const rowsInput = document.getElementById('rows');

// Dimensiuni și constante
const PIN_RADIUS = 5; // Pini mai mari pentru vizibilitate
const BALL_RADIUS = 10;
const SLOT_HEIGHT = 30;
const SLOT_WIDTH = 50;
const NUM_SLOTS = 11; // 11 sloturi (ca în imagine)
let PIN_ROWS = parseInt(rowsInput.value); // Numărul de rânduri de pini (din input)
let PIN_SPACING_X = canvas.width / (PIN_ROWS + 2); // Spațiu între pini pe axa X (mai mare)
let PIN_SPACING_Y = (canvas.height - SLOT_HEIGHT) / (PIN_ROWS + 2); // Spațiu vertical (mai mare)
const GRAVITY = 0.1; // Puterea gravitației

// Variabile pentru bilă
let ball = {
    x: canvas.width / 2,
    y: 50,
    dx: 0,
    dy: 2,
    isDropped: false
};

// Sloturi și punctaj (exact ca în imagine)
const slots = [
    { value: 22, color: '#55296b' }, // Violet
    { value: 5, color: '#1f0833' }, // Violet închis
    { value: 2, color: '#8a5cb6' }, // Mov deschis
    { value: 1.4, color: '#6d3f9c' }, // Mov
    { value: 0.6, color: '#4b2c6a' }, // Mov închis
    { value: 0.4, color: '#3a1f4f' }, // Mov foarte închis
    { value: 0.6, color: '#4b2c6a' }, // Mov închis
    { value: 1.4, color: '#6d3f9c' }, // Mov
    { value: 2, color: '#8a5cb6' }, // Mov deschis
    { value: 5, color: '#1f0833' }, // Violet închis
    { value: 22, color: '#55296b' } // Violet
].map((slot, i) => ({
    x: i * (canvas.width / NUM_SLOTS),
    y: canvas.height - SLOT_HEIGHT - 100, // Mutăm sloturile mai sus
    width: canvas.width / NUM_SLOTS,
    height: SLOT_HEIGHT,
    value: slot.value,
    color: slot.color
}));

// Funcție pentru a desena dreptunghiuri rotunjite
function roundRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
}

// Desenează pini în formă de triunghi
function drawPins() {
    ctx.fillStyle = '#ffffff';
    for (let row = 0; row < PIN_ROWS; row++) {
        const pinsInRow = row + 1; // Numărul de pini pe rând (1, 2, 3, ..., PIN_ROWS)
        const startX = (canvas.width - (pinsInRow - 1) * PIN_SPACING_X) / 2; // Centrare pe axa X
        for (let col = 0; col < pinsInRow; col++) {
            const x = startX + col * PIN_SPACING_X; // Poziția X a pinului
            const y = (row + 1) * PIN_SPACING_Y; // Poziția Y a pinului
            ctx.beginPath();
            ctx.arc(x, y, PIN_RADIUS, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Desenează sloturi rotunjite cu culori diferite și gradient pentru ultimul
function drawSlots() {
    slots.forEach((slot, i) => {
        // Desenează slotul rotunjit
        if (slot.value === 22) {
            // Gradient pentru ultimul slot
            const gradient = ctx.createLinearGradient(
                slot.x, slot.y, slot.x + slot.width, slot.y + slot.height
            );
            gradient.addColorStop(0, '#55296b'); // Violet deschis
            gradient.addColorStop(1, '#1f0833'); // Violet închis
            ctx.fillStyle = gradient;
        } else {
            // Culori diferite pentru celelalte sloturi
            ctx.fillStyle = slot.color;
        }

        roundRect(slot.x, slot.y, slot.width, slot.height, 10); // Rotunjire colțuri
        ctx.fill();

        // Desenează textul multiplicatorului în interiorul slotului
        ctx.fillStyle = '#ffffff'; // Culoarea textului
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${slot.value}×`, slot.x + slot.width / 2, slot.y + 20);
    });
}

// Desenează bila
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#e91e63';
    ctx.fill();
}

// Actualizează poziția bilei
function updateBall() {
    if (!ball.isDropped) return;

    // Aplică gravitația
    ball.dy += GRAVITY; // Crește viteza verticală a bilei

    // Actualizează poziția bilei
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Verifică coliziunea cu pini
    for (let row = 0; row < PIN_ROWS; row++) {
        const pinsInRow = row + 1; // Numărul de pini pe rând
        const startX = (canvas.width - (pinsInRow - 1) * PIN_SPACING_X) / 2; // Centrare pe axa X
        for (let col = 0; col < pinsInRow; col++) {
            const pinX = startX + col * PIN_SPACING_X; // Poziția X a pinului
            const pinY = (row + 1) * PIN_SPACING_Y; // Poziția Y a pinului
            const distance = Math.sqrt((ball.x - pinX) ** 2 + (ball.y - pinY) ** 2);

            if (distance < BALL_RADIUS + PIN_RADIUS) {
                // Calculăm unghiul de coliziune
                const angle = Math.atan2(ball.y - pinY, ball.x - pinX);

                // Ajustăm viteza bilei după coliziune
                const speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
                ball.dx = Math.cos(angle) * speed * 0.5; // Reducem viteza după coliziune (0.5 în loc de 0.8)
                ball.dy = Math.sin(angle) * speed * 0.5; // Reducem impulsul vertical (0.5 în loc de 0.8)

                // Adăugăm o mică variație aleatoare în direcția bilei
                ball.dx += (Math.random() - 0.5) * 0.5; // Variație aleatoare mai mică (0.5 în loc de 1)

                // Asigură că bila nu rămâne blocată
                ball.x += Math.cos(angle) * (BALL_RADIUS + PIN_RADIUS - distance);
                ball.y += Math.sin(angle) * (BALL_RADIUS + PIN_RADIUS - distance);
            }
        }
    }

    // Verifică dacă bila a ajuns în sloturi
    if (ball.y + BALL_RADIUS >= canvas.height - SLOT_HEIGHT - 100) { // Ajustăm pentru poziția sloturilor
        ball.isDropped = false;
        const slot = slots.find(s => ball.x >= s.x && ball.x <= s.x + s.width);
        if (slot) {
            const betAmount = parseFloat(betAmountInput.value);
            const riskLevel = riskLevelSelect.value;
            let multiplier = 1;

            if (riskLevel === 'low') multiplier = 0.5;
            else if (riskLevel === 'medium') multiplier = 1;
            else if (riskLevel === 'high') multiplier = 2;

            const score = betAmount * multiplier * slot.value;
            scoreDisplay.textContent = `Score: ${score.toFixed(2)}`;
        }
    }
}

// Loop-ul principal al jocului
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPins(); // Desenează pini
    drawSlots(); // Desenează sloturi rotunjite cu culori diferite și gradient pentru ultimul
    drawBall(); // Desenează bila
    updateBall(); // Actualizează poziția bilei
    requestAnimationFrame(gameLoop);
}

// Ascultător pentru butonul de drop
dropBallButton.addEventListener('click', () => {
    if (!ball.isDropped) {
        ball.isDropped = true;
        ball.x = canvas.width / 2;
        ball.y = 50;
        ball.dx = 0;
        ball.dy = 2; // Resetăm viteza bilei
    }
});

// Ascultător pentru schimbarea numărului de rânduri
rowsInput.addEventListener('input', () => {
    PIN_ROWS = parseInt(rowsInput.value);
    PIN_SPACING_X = canvas.width / (PIN_ROWS + 2); // Actualizăm spațiul între pini
    PIN_SPACING_Y = (canvas.height - SLOT_HEIGHT) / (PIN_ROWS + 2); // Actualizăm spațiul vertical
});

// Pornește jocul
gameLoop();