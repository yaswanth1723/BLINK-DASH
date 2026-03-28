// ================= GAME STATE =================
let gameSeq = [];
let userSeq = [];
let level = 0;
let started = false;
let accepting = false;
let soundOn = true;

const colors = ["red", "yellow", "blue", "green"];

const levelEl = document.getElementById("level");
const highScoreEl = document.getElementById("highScore");
const status = document.getElementById("status");

let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.innerText = highScore;


// ================= START GAME =================
document.getElementById("startBtn").addEventListener("click", startGame);

function startGame() {
  if (started) return;

  started = true;
  level = 0;
  gameSeq = [];
  status.innerText = "Game Started!";

  startBtn.innerText = "Playing...";
  startBtn.disabled = true;
  startBtn.style.color="BLACK";
  startBtn.style.opacity = "0.6";
  startBtn.style.cursor = "not-allowed";

  
  nextLevel();
}


// ================= NEXT LEVEL =================
function nextLevel() {
  userSeq = [];
  accepting = false;

  level++;
  levelEl.innerText = level;
  status.innerText = "Watch...";

  // Generate new color
  let rand = colors[Math.floor(Math.random() * 4)];
  gameSeq.push(rand);

  // 👉 ONLY flash latest color (advanced mode)
  let lastColor = gameSeq[gameSeq.length - 1];
  let btn = document.querySelector(`[data-color="${lastColor}"]`);

  setTimeout(() => {
    flash(btn);
    playSound(lastColor);

    accepting = true;
    status.innerText = "Your turn";
  }, 400);
}


// ================= BUTTON CLICK =================
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!accepting) return;

    let color = btn.dataset.color;
    userSeq.push(color);

    flash(btn);
    playSound(color);
    vibrate();

    checkAnswer(userSeq.length - 1);
  });
});


// ================= CHECK ANSWER =================
function checkAnswer(i) {
  if (userSeq[i] === gameSeq[i]) {

    // If sequence complete → next level
    if (userSeq.length === gameSeq.length) {
      accepting = false;

      setTimeout(() => {
        nextLevel();
      }, 800);
    }

  } else {
    gameOver();
  }
}


// ================= FLASH EFFECT =================
function flash(btn) {
  btn.classList.add("active");
  setTimeout(() => {
    btn.classList.remove("active");
  }, 200);
}


// ================= SOUND =================
function playSound(color) {
  if (!soundOn) return;

  let audio = new Audio(
    `https://s3.amazonaws.com/freecodecamp/simonSound${colors.indexOf(color)+1}.mp3`
  );
  audio.play();
}


// ================= VIBRATION =================
function vibrate() {
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}


// ================= GAME OVER =================
function gameOver() {
  status.innerHTML = "Game Over! Press Start";

  document.body.style.background = "red";

  setTimeout(() => {
    document.body.style.background = "";
  }, 300);

  // Update High Score
  if (level > highScore) {
    highScore = level;
    localStorage.setItem("highScore", highScore);
    highScoreEl.innerText = highScore;
  }

  started = false;
  accepting = false;

  const startBtn = document.getElementById("startBtn");
  startBtn.innerText = "Start";
  startBtn.disabled = false;
  startBtn.style.opacity = "1";
  startBtn.style.cursor = "pointer";
}


// ================= THEME TOGGLE =================
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});


// ================= SOUND TOGGLE =================
document.getElementById("soundToggle").addEventListener("click", () => {
  soundOn = !soundOn;
});