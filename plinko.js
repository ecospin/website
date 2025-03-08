const canvas = document.getElementById('plinkoCanvas');
const ctx = canvas.getContext('2d');
const dropBallButton = document.getElementById('dropBallButton');
const scoreDisplay = document.getElementById('scoreDisplay');
const betAmountInput = document.getElementById('betAmount');
const riskLevelSelect = document.getElementById('riskLevel');
const rowsInput = document.getElementById('rows');
const balanceAmount = document.getElementById('balanceAmount');

// Dimensiuni și constante
const PIN_RADIUS = 5;
const BALL_RADIUS = 10;
const SLOT_HEIGHT = 30;
const SLOT_WIDTH = 50;
const NUM_SLOTS = 11;
let PIN_ROWS = parseInt(rowsInput.value);
let PIN_SPACING_X = canvas.width / (PIN_ROWS + 2);
let PIN_SPACING_Y = (canvas.height - SLOT_HEIGHT) / (PIN_ROWS + 2);
const GRAVITY = 0.1;

// Variabile pentru bilă
let ball = {
    x: canvas.width / 2,
    y: 50,
    dx: 0,
    dy: 2,
    isDropped: false
};

// Sloturi și punctaj
let slots = [
    { value: 22, color: '#55296b' },
    { value: 5, color: '#1f0833' },
    { value: 2, color: '#8a5cb6' },
    { value: 1.4, color: '#6d3f9c' },
    { value: 0.6, color: '#4b2c6a' },
    { value: 0.4, color: '#3a1f4f' },
    { value: 0.6, color: '#4b2c6a' },
    { value: 1.4, color: '#6d3f9c' },
    { value: 2, color: '#8a5cb6' },
    { value: 5, color: '#1f0833' },
    { value: 22, color: '#55296b' }
].map((slot, i) => ({
    x: i * (canvas.width / NUM_SLOTS),
    y: canvas.height - SLOT_HEIGHT - 100,
    width: canvas.width / NUM_SLOTS,
    height: SLOT_HEIGHT,
    value: slot.value,
    color: slot.color
}));

let balance = 100.00; // Suma inițială de bani

function roundRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
}

function drawPins() {
    ctx.fillStyle = '#ffffff';
    for (let row = 0; row < PIN_ROWS; row++) {
        const pinsInRow = row + 1;
        const startX = (canvas.width - (pinsInRow - 1) * PIN_SPACING_X) / 2;
        for (let col = 0; col < pinsInRow; col++) {
            const x = startX + col * PIN_SPACING_X;
            const y = (row + 1) * PIN_SPACING_Y;
            ctx.beginPath();
            ctx.arc(x, y, PIN_RADIUS, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawSlots() {
    slots.forEach((slot, i) => {
        if (slot.value === 22) {
            const gradient = ctx.createLinearGradient(
                slot.x, slot.y, slot.x + slot.width, slot.y + slot.height
            );
            gradient.addColorStop(0, '#55296b');
            gradient.addColorStop(1, '#1f0833');
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = slot.color;
        }

        roundRect(slot.x, slot.y, slot.width, slot.height, 10);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${slot.value}×`, slot.x + slot.width / 2, slot.y + 20);
    });
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#e91e63';
    ctx.fill();
}

function updateBall() {
    if (!ball.isDropped) return;

    ball.dy += GRAVITY;
    ball.x += ball.dx;
    ball.y += ball.dy;

    for (let row = 0; row < PIN_ROWS; row++) {
        const pinsInRow = row + 1;
        const startX = (canvas.width - (pinsInRow - 1) * PIN_SPACING_X) / 2;
        for (let col = 0; col < pinsInRow; col++) {
            const pinX = startX + col * PIN_SPACING_X;
            const pinY = (row + 1) * PIN_SPACING_Y;
            const distance = Math.sqrt((ball.x - pinX) ** 2 + (ball.y - pinY) ** 2);

            if (distance < BALL_RADIUS + PIN_RADIUS) {
                const angle = Math.atan2(ball.y - pinY, ball.x - pinX);
                const speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
                ball.dx = Math.cos(angle) * speed * 0.5;
                ball.dy = Math.sin(angle) * speed * 0.5;
                ball.dx += (Math.random() - 0.5) * 0.5;
                ball.x += Math.cos(angle) * (BALL_RADIUS + PIN_RADIUS - distance);
                ball.y += Math.sin(angle) * (BALL_RADIUS + PIN_RADIUS - distance);
            }
        }
    }

    if (ball.y + BALL_RADIUS >= canvas.height - SLOT_HEIGHT - 100) {
        ball.isDropped = false;
        const slot = slots.find(s => ball.x >= s.x && ball.x <= s.x + s.width);
        if (slot) {
            const betAmount = parseFloat(betAmountInput.value);
            if (betAmount <= 0 || betAmount > balance) {
                scoreDisplay.textContent = "Invalid bet amount!";
                return;
            }

            const riskLevel = riskLevelSelect.value;
            let multiplier = 1;

            if (riskLevel === 'low') multiplier = 0.5;
            else if (riskLevel === 'medium') multiplier = 1;
            else if (riskLevel === 'high') multiplier = 2;

            const score = betAmount * multiplier * slot.value;
            balance += score - betAmount;
            balanceAmount.textContent = balance.toFixed(2);
            scoreDisplay.textContent = `Score: ${score.toFixed(2)}`;

            if (score > betAmount) {
                scoreDisplay.classList.add('win');
                setTimeout(() => scoreDisplay.classList.remove('win'), 500);
            } else {
                scoreDisplay.classList.add('lose');
                setTimeout(() => scoreDisplay.classList.remove('lose'), 500);
            }
        }
    }
}

function updateSlots() {
    const riskLevel = riskLevelSelect.value;
    let multiplier = 1;

    if (riskLevel === 'low') multiplier = 0.5;
    else if (riskLevel === 'medium') multiplier = 1;
    else if (riskLevel === 'high') multiplier = 2;

    slots = [
        { value: 22 * multiplier, color: '#55296b' },
        { value: 5 * multiplier, color: '#1f0833' },
        { value: 2 * multiplier, color: '#8a5cb6' },
        { value: 1.4 * multiplier, color: '#6d3f9c' },
        { value: 0.6 * multiplier, color: '#4b2c6a' },
        { value: 0.4 * multiplier, color: '#3a1f4f' },
        { value: 0.6 * multiplier, color: '#4b2c6a' },
        { value: 1.4 * multiplier, color: '#6d3f9c' },
        { value: 2 * multiplier, color: '#8a5cb6' },
        { value: 5 * multiplier, color: '#1f0833' },
        { value: 22 * multiplier, color: '#55296b' }
    ].map((slot, i) => ({
        x: i * (canvas.width / NUM_SLOTS),
        y: canvas.height - SLOT_HEIGHT - 100,
        width: canvas.width / NUM_SLOTS,
        height: SLOT_HEIGHT,
        value: slot.value,
        color: slot.color
    }));
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPins();
    drawSlots();
    drawBall();
    updateBall();
    requestAnimationFrame(gameLoop);
}

dropBallButton.addEventListener('click', () => {
    if (!ball.isDropped) {
        ball.isDropped = true;
        ball.x = canvas.width / 2;
        ball.y = 50;
        ball.dx = 0;
        ball.dy = 2;
    }
});

rowsInput.addEventListener('input', () => {
    PIN_ROWS = parseInt(rowsInput.value);
    PIN_SPACING_X = canvas.width / (PIN_ROWS + 2);
    PIN_SPACING_Y = (canvas.height - SLOT_HEIGHT) / (PIN_ROWS + 2);
});

riskLevelSelect.addEventListener('change', () => {
    updateSlots();
});

gameLoop();