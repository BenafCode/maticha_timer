/* ============================================================
   MA · 間 — Maticha Focus Timer
   ============================================================ */

const STORE = 'ma_timer_v1';
const RING_C = 289.027; // 2 * Math.PI * 46

const MODES = {
  focus: { label: 'Focus',       phrase: 'one breath of work', tint: '#bd4a2c' },
  short: { label: 'Short Break', phrase: 'rest, lightly',      tint: '#3f88a3' },
  long:  { label: 'Long Break',  phrase: 'step away',          tint: '#3f88a3' },
};

const DEFAULTS = {
  durations: { focus: 25, short: 5, long: 15 },
  autoBreak: true,
  autoFocus: false,
  interval: 4,
};

// ─── Stoic quotes ─────────────────────────────────────────────
const quotes = [
  { author: "Epictetus", quote: "Don't explain your philosophy. Embody it." },
  { author: "Epictetus", quote: "Make the best use of what is in your power, and take the rest as it happens." },
  { author: "Epictetus", quote: "No great thing is created suddenly." },
  { author: "Epictetus", quote: "The key is to keep company only with people who uplift you, whose presence calls forth your best." },
  { author: "Epictetus", quote: "Only the educated are free." },
  { author: "Epictetus", quote: "It's not reality that causes trouble, it's your reactions to reality." },
  { author: "Epictetus", quote: "Nature hath given men one tongue but two ears, that we may hear from others twice as much as we speak." },
  { author: "Epictetus", quote: "Know, first, who you are, and then adorn yourself accordingly." },
  { author: "Epictetus", quote: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has." },
  { author: "Epictetus", quote: "Men are not disturbed by things, but by the views which they take of them." },
  { author: "Epictetus", quote: "Silence is safer than speech." },
  { author: "Epictetus", quote: "Wealth consists not in having great possessions, but in having few wants." },
  { author: "Epictetus", quote: "To accuse others for one's own misfortune is a sign of want of education. To accuse oneself shows that one's education has begun." },
  { author: "Epictetus", quote: "If you wish to be a writer, write." },
  { author: "Epictetus", quote: "Learn to be indifferent to what makes no difference." },
  { author: "Epictetus", quote: "The greater the difficulty, the greater the glory." },
  { author: "Seneca", quote: "Difficult times often bring out the best in people." },
  { author: "Seneca", quote: "True happiness is to enjoy the present, without anxious dependence upon the future." },
  { author: "Seneca", quote: "We should every night call ourselves to an account: What infirmity have I mastered today? What passions opposed? What temptation resisted?" },
  { author: "Seneca", quote: "Life is long if you know how to use it." },
  { author: "Seneca", quote: "The whole future lies in uncertainty: live immediately." },
  { author: "Seneca", quote: "Leisure without literature is death, and literature without leisure is slavery." },
  { author: "Seneca", quote: "Associate with people who are likely to improve you." },
  { author: "Seneca", quote: "As long as you live, keep learning how to live." },
  { author: "Seneca", quote: "What progress, you ask, have I made? I have begun to be a friend to myself." },
  { author: "Seneca", quote: "Time discovers truth." },
  { author: "Seneca", quote: "Wisdom does not show itself so much in precept as in life." },
  { author: "Seneca", quote: "Nothing is ours, except time." },
  { author: "Seneca", quote: "We suffer more often in imagination than in reality." },
  { author: "Seneca", quote: "Riches do not exhilarate us so much with their possession as they torment us with their loss." },
  { author: "Seneca", quote: "Virtue is nothing else than right reason." },
  { author: "Marcus Aurelius", quote: "Dwell on the beauty of life. Watch the stars, and see yourself running with them." },
  { author: "Marcus Aurelius", quote: "How much more grievous are the consequences of anger than the causes of it." },
  { author: "Marcus Aurelius", quote: "Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present." },
  { author: "Marcus Aurelius", quote: "Accept the things to which fate binds you, and love the people with whom fate brings you together." },
  { author: "Marcus Aurelius", quote: "Reject your sense of injury and the injury itself disappears." },
  { author: "Marcus Aurelius", quote: "Be tolerant with others and strict with yourself." },
  { author: "Marcus Aurelius", quote: "Death smiles at us all, but all a man can do is smile back." },
  { author: "Marcus Aurelius", quote: "The object of life is not to be on the side of the majority, but to escape finding oneself in the ranks of the insane." },
  { author: "Marcus Aurelius", quote: "Look well into thyself; there is a source of strength which will always spring up if thou wilt always look." },
  { author: "Marcus Aurelius", quote: "When you arise in the morning, think of what a precious privilege it is to be alive — to breathe, to think, to enjoy, to love." },
  { author: "Marcus Aurelius", quote: "Perfection of character is this: to live each day as if it were your last, without frenzy, without apathy, without pretense." },
  { author: "Marcus Aurelius", quote: "The impediment to action advances action. What stands in the way becomes the way." },
  { author: "Marcus Aurelius", quote: "The universe is transformation; our life is what our thoughts make it." },
  { author: "Marcus Aurelius", quote: "Do every act of your life as if it were your last." },
  { author: "Marcus Aurelius", quote: "Adapt yourself to the things among which your lot has been cast and love sincerely the fellow creatures with whom destiny has ordained that you shall live." },
];

// ─── State ────────────────────────────────────────────────────
let state = loadState();
let tickInterval = null;
let quoteIndex = 0;

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE)) || {};
    return {
      durations: s.durations || { ...DEFAULTS.durations },
      autoBreak: s.autoBreak ?? DEFAULTS.autoBreak,
      autoFocus: s.autoFocus ?? DEFAULTS.autoFocus,
      interval:  s.interval  || DEFAULTS.interval,
      mode:      s.mode      || 'focus',
      remaining: s.remaining != null ? s.remaining : DEFAULTS.durations.focus * 60,
      completed: s.completed || 0,
      stats:     s.stats     || {},
      streak:    s.streak    || 0,
      lastDay:   s.lastDay   || null,
    };
  } catch (e) {
    return {
      durations: { ...DEFAULTS.durations },
      autoBreak: DEFAULTS.autoBreak,
      autoFocus: DEFAULTS.autoFocus,
      interval:  DEFAULTS.interval,
      mode:      'focus',
      remaining: DEFAULTS.durations.focus * 60,
      completed: 0,
      stats:     {},
      streak:    0,
      lastDay:   null,
    };
  }
}

function saveState() {
  localStorage.setItem(STORE, JSON.stringify({ ...state, running: false }));
}

// ─── DOM refs ─────────────────────────────────────────────────
const timerDisplay = document.getElementById('timer-display');
const ringProg     = document.getElementById('ring-prog');
const disc         = document.getElementById('disc');
const phaseText    = document.getElementById('phase-text');
const toggleBtn    = document.getElementById('toggle-btn');
const resetBtn     = document.getElementById('reset-btn');
const sessionDots  = document.getElementById('session-dots');
const sessionLabel = document.getElementById('session-label');
const streakCount  = document.getElementById('streak-count');
const statSessions = document.getElementById('stat-sessions');
const statMinutes  = document.getElementById('stat-minutes');
const chartEl      = document.getElementById('chart');
const quoteText    = document.getElementById('quote-text');
const quoteAuthor  = document.getElementById('quote-author');

// ─── Render ───────────────────────────────────────────────────
function render() {
  const { durations, mode, remaining, completed, interval, streak, stats } = state;
  const running = !!tickInterval;
  const total = durations[mode] * 60;
  const progress = total > 0 ? (total - remaining) / total : 0;
  const M = MODES[mode];

  // Timer digits — fixed-width spans prevent layout jitter
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const str  = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  timerDisplay.setAttribute('aria-label', str);
  timerDisplay.innerHTML = str.split('').map(ch =>
    ch === ':' ? `<span class="c">:</span>` : `<span class="d">${ch}</span>`
  ).join('');

  // Ring progress
  ringProg.setAttribute('stroke-dashoffset', RING_C * (1 - progress));
  ringProg.setAttribute('stroke', M.tint);

  // Disc accent color (drives ::before halftone + ::after ring via currentColor)
  disc.style.color = M.tint;

  // Phase line
  phaseText.textContent = running ? M.phrase : `${M.label} — ${durations[mode]} min`;

  // Toggle button
  if (running) {
    toggleBtn.innerHTML = '<span class="pause"><i></i><i></i></span>Pause';
    toggleBtn.setAttribute('aria-label', 'Pause timer');
  } else if (remaining < total && remaining > 0) {
    toggleBtn.innerHTML = '<span class="play"></span>Resume';
    toggleBtn.setAttribute('aria-label', 'Resume timer');
  } else {
    toggleBtn.innerHTML = '<span class="play"></span>Begin';
    toggleBtn.setAttribute('aria-label', 'Begin timer');
  }

  // Mode tabs
  document.querySelectorAll('.mode').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  // Session dots
  const sessionPos = completed % interval;
  sessionDots.innerHTML = Array.from({ length: interval }).map((_, i) => {
    const done = i < sessionPos;
    const cur  = i === sessionPos && mode === 'focus';
    return `<div class="dot${done ? ' done' : ''}${cur ? ' current' : ''}"></div>`;
  }).join('');
  const sessionNum = sessionPos + (mode === 'focus' ? 1 : 0);
  sessionLabel.textContent = `session ${sessionNum} of ${interval} · long break after ${interval}`;

  // Streak
  streakCount.textContent = streak;

  // Stats
  const tk = todayKey();
  const todayN = stats[tk] || 0;
  statSessions.textContent = todayN;
  statMinutes.textContent  = todayN * durations.focus;

  // 7-day chart
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    days.push({ n: stats[k] || 0, label: ['S','M','T','W','T','F','S'][d.getDay()], today: i === 0 });
  }
  const maxN = Math.max(4, ...days.map(d => d.n));
  chartEl.innerHTML = days.map(d =>
    `<div class="bar-col">
      <div class="bar${d.today ? ' today' : ''}" style="height:${Math.max(4,(d.n/maxN)*72)}px"></div>
      <div class="day">${d.label}</div>
    </div>`
  ).join('');

  // Steppers
  document.querySelectorAll('.stepper').forEach(s => {
    const key = s.dataset.key;
    s.querySelector('.step-val').textContent = key === 'interval' ? interval : durations[key];
  });

  // Toggles
  document.querySelectorAll('.toggle').forEach(t => {
    const on = state[t.dataset.key];
    t.classList.toggle('on', on);
    t.setAttribute('aria-pressed', String(on));
  });

  saveState();
}

// ─── Timer ────────────────────────────────────────────────────
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function tick() {
  state.remaining--;
  render();
  if (state.remaining <= 0) {
    clearInterval(tickInterval);
    tickInterval = null;
    complete();
  }
}

function complete() {
  const { mode, durations, interval, autoBreak, autoFocus } = state;

  if (mode === 'focus') {
    chime(true);
    const tk = todayKey();
    state.stats[tk] = (state.stats[tk] || 0) + 1;
    bumpStreak();
    state.completed++;
    const next = (state.completed % interval === 0) ? 'long' : 'short';
    state.mode = next;
    state.remaining = durations[next] * 60;
    render();
    if (autoBreak) setTimeout(() => { tickInterval = setInterval(tick, 1000); render(); }, 400);
  } else {
    chime(false);
    state.mode = 'focus';
    state.remaining = durations.focus * 60;
    render();
    if (autoFocus) setTimeout(() => { tickInterval = setInterval(tick, 1000); render(); }, 400);
  }
}

function bumpStreak() {
  const tk = todayKey();
  if (state.lastDay === tk) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yk = `${y.getFullYear()}-${y.getMonth()+1}-${y.getDate()}`;
  state.streak = (state.lastDay === yk) ? state.streak + 1 : 1;
  state.lastDay = tk;
}

function toggleTimer() {
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
    render();
    return;
  }
  if (state.remaining <= 0) state.remaining = state.durations[state.mode] * 60;
  tickInterval = setInterval(tick, 1000);
  render();
}

function resetTimer() {
  clearInterval(tickInterval);
  tickInterval = null;
  state.remaining = state.durations[state.mode] * 60;
  render();
}

function switchMode(newMode) {
  clearInterval(tickInterval);
  tickInterval = null;
  state.mode = newMode;
  state.remaining = state.durations[newMode] * 60;
  render();
}

// ─── Chime ────────────────────────────────────────────────────
function chime(ascending) {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const notes = ascending ? [523.25, 659.25, 783.99] : [392.00, 329.63, 261.63];
    notes.forEach((f, i) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.value = f;
      o.connect(g); g.connect(ac.destination);
      const t = ac.currentTime + i * 0.16;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.14, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      o.start(t); o.stop(t + 0.95);
    });
  } catch (e) {}
}

// ─── Quotes ───────────────────────────────────────────────────
function showNextQuote() {
  if (quoteIndex >= quotes.length) quoteIndex = 0;
  const { quote, author } = quotes[quoteIndex++];
  quoteText.textContent   = `"${quote}"`;
  quoteAuthor.textContent = `— ${author}`;
}

// ─── Event listeners ──────────────────────────────────────────
toggleBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);

document.querySelectorAll('.mode').forEach(btn => {
  btn.addEventListener('click', () => switchMode(btn.dataset.mode));
});

document.querySelectorAll('.stepper').forEach(stepper => {
  const key  = stepper.dataset.key;
  const min  = parseInt(stepper.dataset.min);
  const max  = parseInt(stepper.dataset.max);
  const step = parseInt(stepper.dataset.step);

  function adjust(delta) {
    if (key === 'interval') {
      state.interval = Math.min(max, Math.max(min, state.interval + delta));
    } else {
      state.durations[key] = Math.min(max, Math.max(min, state.durations[key] + delta));
      if (key === state.mode && !tickInterval) state.remaining = state.durations[key] * 60;
    }
    render();
  }

  stepper.querySelector('.step-dec').addEventListener('click', () => adjust(-step));
  stepper.querySelector('.step-inc').addEventListener('click', () => adjust(+step));
});

document.querySelectorAll('.toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    state[toggle.dataset.key] = !state[toggle.dataset.key];
    render();
  });
});

// ─── Init ─────────────────────────────────────────────────────
setInterval(showNextQuote, 180 * 1000);
showNextQuote();
render();
