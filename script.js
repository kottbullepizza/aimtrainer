const canvas = document.getElementById('gameboard-canvas');
const scoreboardCanvas = document.getElementById('scoreboard-canvas');
const ctx = canvas.getContext('2d');
const scoreboardCtx = scoreboardCanvas.getContext('2d');
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
const scoreboardBtn = document.getElementById('scoreboard-btn');
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

let rounds = [];
let inputs = { difficulty: 0, size: 0, time: 0, pop: false };
updateInputs();

canvas.addEventListener("mousedown", (event) => handleClick(event));
startBtns.forEach(btn => btn.addEventListener("click", () => startGame()));
settingsBtn.addEventListener("click", () => displaySettings());
scoreboardBtn.addEventListener("click", () => displayScoreboard());
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
    if(clicks > 0) {
        rounds.push({
            score: score, 
            clicks: clicks
        });
    }
    updateScoreboard();
    scoreboard.style.display = 'grid';
}

function displaySettings() {
    scoreboard.style.display = 'none';
    scoreboardBtn.style.display = 'inline-block';
    settings.style.display = 'grid';
}

function displayScoreboard() {
    drawScoreboard();
    scoreboard.style.display = 'grid';
    settings.style.display = 'none';
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

function drawScoreboard() {
    scoreboardCtx.clearRect(0, 0, canvas.width, canvas.height);

    const distanceX = scoreboardCanvas.width / (rounds.length + 1);
    const windowHeight = scoreboardCanvas.height - 10; // 5px padding at the top and bottom
    const windowWidth = scoreboardCanvas.width - 10; // 5px padding left and right

    // x- and y-axis
    scoreboardCtx.beginPath();
    scoreboardCtx.moveTo(5, 5);
    scoreboardCtx.lineTo(5, windowHeight+5);
    scoreboardCtx.moveTo(5, windowHeight+5);
    scoreboardCtx.lineTo(windowWidth+5, windowHeight+5);
    scoreboardCtx.lineWidth = 2;
    scoreboardCtx.strokeStyle = primaryColor;
    scoreboardCtx.stroke();

    // y-axis text
    for(let i = 10; i <= 100; i+=10) {
        scoreboardCtx.font = "10px Lucida Console";
        scoreboardCtx.textBaseline = "middle";
        scoreboardCtx.textAlign = "left";
        scoreboardCtx.fillStyle = "orange";
        scoreboardCtx.fillText(i, 10, windowHeight - (i / 100) * windowHeight + 5);
    }

    let lastPointProps = [];

    for(let round of rounds) {
        let {score, clicks} = round;
        console.log(`score: ${score} clicks: ${clicks}`);

        let x = distanceX * (rounds.indexOf(round) + 1);

        // x-axis text
        scoreboardCtx.font = "10px Lucida Console";
        scoreboardCtx.textBaseline = "middle";
        scoreboardCtx.fillStyle = "orange";
        scoreboardCtx.fillText(rounds.indexOf(round)+1, x, windowHeight);

        let scoreY = windowHeight - (score/100) * windowHeight + 5;
        let clicksY = windowHeight - (clicks/100) * windowHeight + 5;
        let accuracyY = windowHeight - (score/clicks) * windowHeight + 5;

        let pointProps = [
            {y: scoreY, color: 'orange', name: 'score'},
            {y: clicksY, color: 'cyan', name: 'clicks'},
            {y: accuracyY, color: 'greenyellow', name: 'accuracy'}
        ];

        // draw points
        for(let prop of pointProps) {
            let {y, color, name} = prop;
            scoreboardCtx.beginPath();
            scoreboardCtx.arc(x, y, 3, 0, Math.PI * 2);
            scoreboardCtx.fillStyle = color;
            scoreboardCtx.fill();

            // descriping line-text if last round of rounds
            if(rounds.indexOf(round) === (rounds.length-1)) {
                scoreboardCtx.font = "10px Lucida Console";
                scoreboardCtx.textBaseline = "middle";
                scoreboardCtx.textAlign = "right";
                scoreboardCtx.fillStyle = color;
                let textY = name === 'score' ? y + 5 : y - 5;
                scoreboardCtx.fillText(name, x, textY);
            }

            // draw line between points
            if(lastPointProps.length > 0){
                scoreboardCtx.beginPath();
                scoreboardCtx.moveTo(x - distanceX, lastPointProps[pointProps.indexOf(prop)]["y"]);
                scoreboardCtx.lineTo(x, y);
                scoreboardCtx.lineWidth = 2;
                scoreboardCtx.strokeStyle = color;
                scoreboardCtx.stroke();
            }
        }

        lastPointProps = pointProps.slice(0);
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
        if(Number(element.value) !== inputs[element.name]) {
            inputs[element.name] = Number(element.value);
            rounds = [];
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
    drawScoreboard();
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
