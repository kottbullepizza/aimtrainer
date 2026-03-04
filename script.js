const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const timerLabel = document.getElementById('timer-label');
const scoreLabel = document.getElementById('score-label');
const scoreboard = document.getElementById('scoreboard');
const scoreboardHits = document.getElementById('scoreboard-target-hits');
const scoreboardAccuracy = document.getElementById('scoreboard-click-accuracy');
const settings = document.getElementById('settings');
const difficultyInput = document.getElementById('difficulty');
const sizeInput = document.getElementById('size');
const timeInput = document.getElementById('time');
const popInput = document.getElementById('pop');
const inputLabels = document.querySelectorAll('.label');
const inputElements = document.querySelectorAll('.input');
const startBtns = document.querySelectorAll('.start-btn');
const settingsBtn = document.getElementById('settings-btn');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(`width: ${window.innerWidth} height: ${window.innerHeight}`);

let primaryColor = 'orange';
let secondaryColor = 'rgb(250, 250, 245)';

let countDownTime;
let gameOver = true;
let targets;
let score;
let clicks;

let inputs = { difficulty: 0, size: 0, time: 0, pop: false };
updateInputs();

canvas.addEventListener("mousedown", (event) => handleClick(event));
startBtns.forEach(btn => btn.addEventListener("click", () => startGame()));
settingsBtn.addEventListener("click", () => displaySettings());
inputElements.forEach(element => element.addEventListener("input", () => updateInputs()));

function startGame() {
    gameOver = false;
    targets = [];
    score = 0;
    clicks = 0;
    setTimer();
    scoreLabel.textContent = `Score: ${score}`;
    scoreboard.style.display = 'none';
    settings.style.display = 'none';
    initializeTargets(inputs["difficulty"]);
    drawTargets();
    startTimer();
}

function stopGame() {
    gameOver = true;
    updateScoreboard();
    scoreboard.style.display = 'grid';
}

function displaySettings() {
    scoreboard.style.display = 'none';
    settings.style.display = 'grid';
}

function createTargetObject(x, y, radius) {
    let newTarget = {
        x: x,
        y: y,
        radius: radius,
    }
    targets.push(newTarget);
}

function drawTargets() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the whole canvas

    for(let {x, y, radius} of targets) {
        for(let i = 0; i < 5; i++) { // draws a single target
            ctx.beginPath();
            ctx.arc(x, y, radius - (radius/5*i), 0, Math.PI * 2);
            ctx.fillStyle = (i & 1) === 0 ? primaryColor : secondaryColor; // alternates color (orange/white)
            ctx.fill();
        }
    }
}

function initializeTargets(number) {
    for(let i = 0; i < number; i++) {
        createTargetObject(0, 0, inputs["size"]);
    }
    for(let target of targets) {
        moveTarget(target);
    }
}

function moveTarget(target) {
    target.x = Math.floor(Math.random() * (window.innerWidth - 2*target.radius)) + target.radius;
    target.y = Math.floor(Math.random() * (window.innerHeight - 2*target.radius)) + target.radius;
}

function deleteTarget(target) {
    targets.splice(targets.indexOf(target), 1);
}

function setTimer() {
    countDownTime = new Date().getTime() + inputs["time"]*1000;
    updateTimer();
}

function startTimer() {
    if (gameOver) return;
    updateTimer();
    
    requestAnimationFrame(startTimer);
}

function updateTimer() {
    const currentTime = new Date().getTime();
    if(countDownTime - currentTime > 0) {
        timerLabel.textContent = `Time: ${Math.floor((countDownTime - currentTime) / 1000)}`;
    } else {
        stopGame();
    }
}

function updateInputs() {
    // update values in inputs object
    inputElements.forEach(element => {
        let value = element.value;
        if (element.type === 'checkbox') {
            inputs[element.name] = element.checked;
        } else if (element.type === 'range') {
            inputs[element.name] = Number(element.value);
        }
    });
    console.log(inputs);

    // update labels
    inputLabels.forEach(label => {
        let identifier = label.id.slice(0, label.id.indexOf('-'));
        let unit = identifier === 'difficulty' ? 'targets' : identifier === 'size' ? 'pixels' : identifier === 'time' ? 'seconds' : 'undentified';
        label.textContent = `${identifier}: ${inputs[identifier]} ${unit}`;
    });

    // update sliders
    updateSliders();
}

function updateSliders() {
    inputElements.forEach(element => {
        const distance = element.max - element.min;
        const pct = ((element.value - element.min) / distance) * 100 + '%';
        //const pct = ((element.value - element.min) / element.max) * 100 + '%';
        element.style.setProperty('--range-pct', pct);
    })
}

function updateScoreboard() {
    scoreboardHits.textContent = `Target hits: ${score}`;
    scoreboardAccuracy.textContent = `Click accuracy: ${clicks > 0 ? Math.round(score/clicks*100) : 0}%`;
}

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for(let i = targets.length-1; i >= 0; i--){
        let {x, y, radius} = targets[i];
        let d = Math.sqrt((mouseX - x)**2 + (mouseY - y)**2);
        if(d <= radius) {
            console.log('You hit a target!');
            score++;
            scoreLabel.textContent = `Score: ${score}`;
            if(inputs["pop"]) {
                deleteTarget(targets[i]);
            } else {
                moveTarget(targets[i]);
            }
            drawTargets();
            break;
        }
    }
    clicks++;
}