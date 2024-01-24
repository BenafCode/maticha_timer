let timeLeft = 1500; // 25 minutes in seconds
let timerInterval;

function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timeLeft = 1500;
  updateTimer();
}

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  document.getElementById("timer").textContent = `${minutes}:${seconds}`;

  if (timeLeft === 0) {
    stopTimer();
  } else {
    timeLeft--;
  }
}
