let timeLeft = 1500;
let timerInterval = null;
let quoteIndex = 0;

const quotes = [
  { author: "Epictetus", quote: "Don't explain your philosophy. Embody it." },
  { author: "Epictetus", quote: "Make the best use of what is in your power, and take the rest as it happens." },
  { author: "Epictetus", quote: "No great thing is created suddenly." },
  { author: "Epictetus", quote: "The key is to keep company only with people who uplift you, whose presence calls forth your best." },
  { author: "Epictetus", quote: "The greater the difficulty, the greater the glory." },
  { author: "Epictetus", quote: "Only the educated are free." },
  { author: "Epictetus", quote: "It's not reality that causes trouble, it's your reactions to reality." },
  { author: "Epictetus", quote: "Seek not after pleasure for her own sake, but learn to love whatever chooses to come." },
  { author: "Epictetus", quote: "Nature hath given men one tongue but two ears, that we may hear from others twice as much as we speak." },
  { author: "Epictetus", quote: "Know, first, who you are, and then adorn yourself accordingly." },
  { author: "Epictetus", quote: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has." },
  { author: "Epictetus", quote: "Men are not disturbed by things, but by the views which they take of them." },
  { author: "Epictetus", quote: "Silence is safer than speech." },
  { author: "Epictetus", quote: "Cultivation of simplicity involves elimination of waste." },
  { author: "Epictetus", quote: "Wealth consists not in having great possessions, but in having few wants." },
  { author: "Epictetus", quote: "To accuse others for one's own misfortune is a sign of want of education. To accuse oneself shows that one's education has begun. To accuse neither oneself nor others shows that one's education is complete." },
  { author: "Epictetus", quote: "Attitude is a choice. Happiness is a choice. Optimism is a choice. Kindness is a choice. Giving is a choice. Respect is a choice. Whatever choice you make makes you. Choose wisely." },
  { author: "Epictetus", quote: "If you wish to be a writer, write." },
  { author: "Epictetus", quote: "Learn to be indifferent to what makes no difference." },
  { author: "Epictetus", quote: "If anyone tells you that a certain person speaks ill of you, do not make excuses about what is said of you but answer, 'He was ignorant of my other faults, else he would not have mentioned these alone.'" },
  { author: "Seneca", quote: "Difficult times often bring out the best in people." },
  { author: "Seneca", quote: "True happiness is... to enjoy the present, without anxious dependence upon the future." },
  { author: "Seneca", quote: "We should every night call ourselves to an account: What infirmity have I mastered today? What passions opposed? What temptation resisted? What virtue acquired?" },
  { author: "Seneca", quote: "Life is long if you know how to use it." },
  { author: "Seneca", quote: "The whole future lies in uncertainty: live immediately." },
  { author: "Seneca", quote: "Leisure without literature is death, and literature without leisure is slavery." },
  { author: "Seneca", quote: "Associate with people who are likely to improve you." },
  { author: "Seneca", quote: "As long as you live, keep learning how to live." },
  { author: "Seneca", quote: "What progress, you ask, have I made? I have begun to be a friend to myself." },
  { author: "Seneca", quote: "Time discovers truth." },
  { author: "Seneca", quote: "Wisdom does not show itself so much in precept as in life." },
  { author: "Seneca", quote: "Believe me, prosperity is nothing but a lavish feast at which Fortune sets herself before us to gorge us until she fattens us for the slaughter." },
  { author: "Seneca", quote: "Religion is regarded by the common people as true, by the wise as false, and by the rulers as useful." },
  { author: "Seneca", quote: "Nothing is ours, except time." },
  { author: "Seneca", quote: "We suffer more often in imagination than in reality." },
  { author: "Seneca", quote: "Every new beginning comes from some other beginning's end." },
  { author: "Seneca", quote: "Riches do not exhilarate us so much with their possession as they torment us with their loss." },
  { author: "Seneca", quote: "We should always allow some time to elapse, for time discloses the truth." },
  { author: "Seneca", quote: "Virtue is nothing else than right reason." },
  { author: "Marcus Aurelius", quote: "Dwell on the beauty of life. Watch the stars, and see yourself running with them." },
  { author: "Marcus Aurelius", quote: "How much more grievous are the consequences of anger than the causes of it." },
  { author: "Marcus Aurelius", quote: "Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present." },
  { author: "Marcus Aurelius", quote: "Accept the things to which fate binds you, and love the people with whom fate brings you together, but do so with all your heart." },
  { author: "Marcus Aurelius", quote: "Reject your sense of injury and the injury itself disappears." },
  { author: "Marcus Aurelius", quote: "Be tolerant with others and strict with yourself." },
  { author: "Marcus Aurelius", quote: "Death smiles at us all, but all a man can do is smile back." },
  { author: "Marcus Aurelius", quote: "The object of life is not to be on the side of the majority, but to escape finding oneself in the ranks of the insane." },
  { author: "Marcus Aurelius", quote: "Look well into thyself; there is a source of strength which will always spring up if thou wilt always look." },
  { author: "Marcus Aurelius", quote: "When you arise in the morning, think of what a precious privilege it is to be alive — to breathe, to think, to enjoy, to love." },
  { author: "Marcus Aurelius", quote: "Perfection of character is this: to live each day as if it were your last, without frenzy, without apathy, without pretense." },
  { author: "Marcus Aurelius", quote: "Our actions may be impeded…but there can be no impeding our intentions or dispositions. Because we can accommodate and adapt. The mind adapts and converts to its own purposes the obstacle to our acting. The impediment to action advances action. What stands in the way becomes the way." },
  { author: "Marcus Aurelius", quote: "Begin each day by telling yourself: Today I shall be meeting with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness. All of them due to the offenders ignorance of what is good or evil." },
  { author: "Marcus Aurelius", quote: "The universe is transformation; our life is what our thoughts make it." },
  { author: "Marcus Aurelius", quote: "Do every act of your life as if it were your last." },
  { author: "Marcus Aurelius", quote: "The best way out is always through." },
  { author: "Marcus Aurelius", quote: "Adapt yourself to the things among which your lot has been cast and love sincerely the fellow creatures with whom destiny has ordained that you shall live." },
];

function toggleTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById("toggle-btn").textContent = "Resume";
  } else {
    timerInterval = setInterval(updateTimer, 1000);
    document.getElementById("toggle-btn").textContent = "Pause";
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = 1500;
  document.getElementById("toggle-btn").textContent = "Start";
  updateDisplay();
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

function updateTimer() {
  if (timeLeft === 0) {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById("toggle-btn").textContent = "Start";
    playCompletionSound();
    return;
  }
  timeLeft--;
  updateDisplay();
}

function playCompletionSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  [0, 0.4, 0.8].forEach((offset) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 528;
    gain.gain.setValueAtTime(0.4, ctx.currentTime + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.35);
    osc.start(ctx.currentTime + offset);
    osc.stop(ctx.currentTime + offset + 0.35);
  });
}

function showNextQuote() {
  if (quoteIndex >= quotes.length) quoteIndex = 0;
  const { quote, author } = quotes[quoteIndex++];
  const container = document.querySelector(".quote-container");
  container.innerHTML = `<p class="quote-text">"${quote}"</p><p class="quote-author">~ ${author}</p>`;
}

setInterval(showNextQuote, 180 * 1000); // rotate every 3 minutes
showNextQuote();
