const symbols = ["⟡", "◈", "⬢", "⬡", "⟐", "✦", "✶", "✷", "✹", "✺", "✸", "✧", "⬣", "✪", "✯", "✴"];

let cards = [];
let selected = [];

let score = 0;
let lives = 0;
let time = 0;
let gridSize = 4;

let timerInterval;

const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const timerEl = document.getElementById("timer");
const log = document.getElementById("log");

function setDifficulty(size) {
    gridSize = size;
    resetGame();
}

function resetGame() {

    clearInterval(timerInterval);

    score = 0;
    selected = [];

    // 🔥 NUEVO BALANCE
    if (gridSize === 4) lives = 10;
    else if (gridSize === 6) lives = 12;
    else lives = 15;

    time = gridSize === 4 ? 60 : gridSize === 6 ? 90 : 120;

    updateHUD();
    initGame();
    startTimer();
}

function updateHUD() {
    scoreEl.innerText = "Score: " + score;
    livesEl.innerText = "Vidas: " + lives;
    timerEl.innerText = "Tiempo: " + time;
}

function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        time--;
        timerEl.innerText = "Tiempo: " + time;

        if (time <= 0) {
            gameOver();
        }

    }, 1000);
}

function initGame() {

    game.innerHTML = "";

    const totalCards = gridSize * gridSize;
    const selectedSymbols = symbols.slice(0, totalCards / 2);

    cards = [...selectedSymbols, ...selectedSymbols];

    cards.sort(() => Math.random() - 0.5);

    game.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    renderGame();
}

function renderGame() {

    game.innerHTML = "";

    cards.forEach(symbol => {

        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.symbol = symbol;

        card.innerText = "?";

        card.addEventListener("click", () => flipCard(card));

        game.appendChild(card);
    });
}

function spawnParticles(x, y) {

    const colors = ["#00ff7b", "#00f5ff", "#aaffcc"];

    for (let i = 0; i < 12; i++) {

        const p = document.createElement("div");
        p.classList.add("particle");

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80 + 20;

        p.style.left = x + "px";
        p.style.top = y + "px";
        p.style.background = colors[Math.floor(Math.random() * colors.length)];

        p.style.setProperty("--x", Math.cos(angle) * distance + "px");
        p.style.setProperty("--y", Math.sin(angle) * distance + "px");

        document.body.appendChild(p);

        setTimeout(() => p.remove(), 800);
    }
}

function showLog(text) {

    const el = document.createElement("div");
    el.classList.add("log-item");
    el.innerText = text;

    log.appendChild(el);

    const rect = log.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top);

    setTimeout(() => el.remove(), 1500);
}

function flipCard(card) {

    if (card.classList.contains("revealed")) return;
    if (selected.length === 2) return;

    card.classList.add("revealed");
    card.innerText = card.dataset.symbol;

    selected.push(card);

    if (selected.length === 2) checkMatch();
}

function checkMatch() {

    const [a, b] = selected;

    if (a.dataset.symbol === b.dataset.symbol) {

        score += 10;
        lives += 1;
        time += 5;

        updateHUD();
        showLog("+1 VIDA ❤️ +5s ⏱️");

    } else {

        lives--;
        updateHUD();

        setTimeout(() => {
            a.classList.remove("revealed");
            b.classList.remove("revealed");
            a.innerText = "?";
            b.innerText = "?";
        }, 500);

        if (lives <= 0) {
            gameOver();
        }
    }

    selected = [];
}

function gameOver() {

    clearInterval(timerInterval);

    alert("💀 Has perdido");

    resetGame();
}

resetGame();