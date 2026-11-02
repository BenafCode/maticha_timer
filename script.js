/* ============================================================
   MA · 間 — Maticha Focus Timer
   ============================================================ */

const STORE = 'ma_timer_v1';

const MODES = {
  focus: { label: 'Focus',       phrase: 'one breath of work', tint: 'var(--accent)' },
  short: { label: 'Short break', phrase: 'rest, lightly',      tint: 'var(--muted)' },
  long:  { label: 'Long break',  phrase: 'step away',          tint: 'var(--muted)' },
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
let controlToken = 0; // invalidates a pending auto-start when the user acts

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
      tasks:     Array.isArray(s.tasks) ? s.tasks : [],
      activeTask: s.activeTask || null,
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
      tasks:     [],
      activeTask: null,
    };
  }
}

function saveState() {
  localStorage.setItem(STORE, JSON.stringify({ ...state, running: false }));
}

// ─── DOM refs ─────────────────────────────────────────────────
const timerDisplay = document.getElementById('timer-display');
const progressFill = document.getElementById('progress-fill');
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
const taskList     = document.getElementById('task-list');
const taskEmpty    = document.getElementById('task-empty');
const taskForm     = document.getElementById('task-form');
const taskError    = document.getElementById('task-error');
const greetingText = document.getElementById('greeting-text');
const greetingDate = document.getElementById('greeting-date');
const statTasks    = document.getElementById('stat-tasks');
const tileStreakC  = document.getElementById('tile-streak-c');
const tileTasksC   = document.getElementById('tile-tasks-c');
const tileSessionsC = document.getElementById('tile-sessions-c');
const phaseChip    = document.getElementById('phase-chip');
const toggleLabel  = document.getElementById('toggle-label');
const themeBtn     = document.getElementById('theme-btn');
const taskInput    = document.getElementById('task-input');
const taskSummary  = document.getElementById('task-summary');
const taskClear    = document.getElementById('task-clear');

// ─── Tasks ────────────────────────────────────────────────────
function escapeHTML(s) {
  return s.replace(/[&<>"']/g, c =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

function activeTask() {
  return state.tasks.find(t => t.id === state.activeTask && !t.done) || null;
}

/** Point activeTask at the first unfinished task when the current one is gone/done. */
function ensureActiveTask() {
  if (activeTask()) return;
  const next = state.tasks.find(t => !t.done);
  state.activeTask = next ? next.id : null;
}

function renderTasks() {
  const { tasks } = state;

  taskEmpty.hidden = tasks.length > 0;

  taskList.innerHTML = tasks.map(t => `
    <li class="task${t.done ? ' done' : ''}${t.id === state.activeTask && !t.done ? ' is-active' : ''}" data-id="${t.id}">
      <button class="task-check" type="button" data-act="toggle"
        aria-label="${t.done ? 'Mark as not done' : 'Mark as done'}"
        aria-pressed="${t.done}"><svg class="icon" aria-hidden="true"><use href="#i-check" /></svg></button>
      <button class="task-text" data-act="select"
        aria-label="Focus on this task">${escapeHTML(t.text)}</button>
      <span class="task-count" title="pomodoros done / estimated">${t.count}/${t.est}</span>
      <span class="task-est">
        <button type="button" data-act="est-dec" aria-label="Decrease estimate"><svg class="icon" aria-hidden="true"><use href="#i-minus" /></svg></button>
        <button type="button" data-act="est-inc" aria-label="Increase estimate"><svg class="icon" aria-hidden="true"><use href="#i-plus" /></svg></button>
      </span>
      <button class="task-del" type="button" data-act="delete" aria-label="Delete task"><svg class="icon" aria-hidden="true"><use href="#i-trash" /></svg></button>
    </li>`).join('');

  const doneCount = tasks.filter(t => t.done).length;
  const remainingPomos = tasks
    .filter(t => !t.done)
    .reduce((sum, t) => sum + Math.max(0, t.est - t.count), 0);

  if (tasks.length === 0) {
    taskSummary.textContent = '';
    taskSummary.hidden = true;
  } else {
    taskSummary.hidden = false;
    const mins = remainingPomos * state.durations.focus;
    const time = mins >= 60
      ? `${Math.floor(mins / 60)}h ${mins % 60 ? (mins % 60) + 'm' : ''}`.trim()
      : `${mins}m`;
    taskSummary.textContent =
      `${doneCount} of ${tasks.length} done · ${remainingPomos} pomodoro${remainingPomos === 1 ? '' : 's'} left (~${time})`;
  }

  taskClear.hidden = doneCount === 0;
}

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
  timerDisplay.classList.toggle('running', !!tickInterval);

  // Hairline progress bar — scaleX so only transform animates (B7)
  progressFill.style.transform = `scaleX(${progress})`;
  progressFill.style.backgroundColor = M.tint;

  // Phase line — name the task being worked on during focus
  const task = activeTask();
  if (mode === 'focus' && task) {
    phaseText.textContent = running ? `${M.phrase} — ${task.text}` : `Next up — ${task.text}`;
  } else {
    phaseText.textContent = running ? M.phrase : `${M.label} — ${durations[mode]} min`;
  }

  // Toggle button
  if (running) {
    setToggleBtn('#i-pause', 'Pause', 'Pause timer');
  } else if (remaining < total && remaining > 0) {
    setToggleBtn('#i-play', 'Resume', 'Resume timer');
  } else {
    setToggleBtn('#i-play', 'Begin', 'Begin timer');
  }

  // Mode tabs
  document.querySelectorAll('.mode').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.mode === mode);
  });

  // Session dots
  const sessionPos = completed % interval;
  sessionDots.innerHTML = Array.from({ length: interval }).map((_, i) => {
    const done = i < sessionPos;
    const cur  = i === sessionPos && mode === 'focus';
    return `<div class="dot${done ? ' done' : ''}${cur ? ' current' : ''}"></div>`;
  }).join('');
  sessionDots.classList.toggle('running', running);
  const sessionNum = sessionPos + (mode === 'focus' ? 1 : 0);
  sessionLabel.textContent = `session ${sessionNum} of ${interval} · long break after ${interval}`;

  // Streak
  streakCount.textContent = streak;
  tileStreakC.textContent = streak === 0 ? 'No days yet'
    : streak === 1 ? 'One day running' : `${numberWord(streak)} days running`;

  // Tasks left, and the greeting that names today's one fact
  const openTasks = state.tasks.filter(t => !t.done);
  const leftPomos = openTasks.reduce((sum, t) => sum + Math.max(0, t.est - t.count), 0);
  statTasks.textContent = openTasks.length;
  tileTasksC.textContent = openTasks.length === 0 ? 'Nothing named yet'
    : `${leftPomos} interval${leftPomos === 1 ? '' : 's'} to go`;

  tileSessionsC.textContent = (stats[todayKey()] || 0) === 0
    ? 'Ready when you are' : 'Each one a full interval';
  phaseChip.textContent = M.label;
  renderGreeting(running);

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
  // Bars and labels are separate rows so the baseline rule runs unbroken
  // beneath the plot, with the weekday letters below it.
  chartEl.innerHTML =
    `<div class="chart-bars">${days.map(d =>
      `<div class="bar-col"><div class="bar${d.today ? ' today' : ''}" ` +
      `style="--v:${Math.max(0.03, d.n / maxN).toFixed(3)}"></div></div>`
    ).join('')}</div>` +
    `<div class="chart-days">${days.map(d =>
      `<span class="day">${d.label}</span>`
    ).join('')}</div>`;

  // Steppers
  document.querySelectorAll('.stepper').forEach(s => {
    const key = s.dataset.key;
    s.querySelector('.step-val').textContent = key === 'interval' ? interval : durations[key];
  });

  // Toggles
  document.querySelectorAll('.toggle').forEach(t => {
    const on = state[t.dataset.key];
    t.classList.toggle('is-on', on);
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

/**
 * Start the timer after an auto-advance delay, but only if the user has not
 * touched the controls in the meantime — otherwise we would orphan the
 * interval they just started and run two tickers at once.
 */
function autoStartAfterDelay() {
  const token = ++controlToken;
  setTimeout(() => {
    if (token !== controlToken || tickInterval) return;
    tickInterval = setInterval(tick, 1000);
    render();
  }, 400);
}

function complete() {
  const { mode, durations, interval, autoBreak, autoFocus } = state;

  if (mode === 'focus') {
    chime(true);
    const tk = todayKey();
    state.stats[tk] = (state.stats[tk] || 0) + 1;
    bumpStreak();
    state.completed++;

    // Credit the pomodoro to the task in focus
    const task = activeTask();
    if (task) {
      task.count++;
      if (task.count >= task.est) {
        task.done = true;
        ensureActiveTask();
      }
    }
    renderTasks();

    const next = (state.completed % interval === 0) ? 'long' : 'short';
    state.mode = next;
    state.remaining = durations[next] * 60;
    render();
    if (autoBreak) autoStartAfterDelay();
  } else {
    chime(false);
    state.mode = 'focus';
    state.remaining = durations.focus * 60;
    render();
    if (autoFocus) autoStartAfterDelay();
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
  controlToken++;
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
  controlToken++;
  clearInterval(tickInterval);
  tickInterval = null;
  state.remaining = state.durations[state.mode] * 60;
  render();
}

function switchMode(newMode) {
  controlToken++;
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
  quoteText.textContent   = quote; // .quote-text::before/::after add the marks
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
      if (key === 'focus') renderTasks(); // summary estimates time from focus length
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

// ─── Task events ──────────────────────────────────────────────
taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = taskInput.value.trim();

  if (!text) {
    showTaskError('Type the task before adding it.');
    return;
  }
  if (state.tasks.some(t => !t.done && t.text.toLowerCase() === text.toLowerCase())) {
    showTaskError('That task is already on the list below.');
    return;
  }
  clearTaskError();

  state.tasks.push({
    id: `t${Date.now()}${Math.floor(Math.random() * 1000)}`,
    text, done: false, est: 1, count: 0,
  });
  taskInput.value = '';
  ensureActiveTask();
  renderTasks();
  render();
});

// Delegated — the list is re-rendered, so listeners cannot live on the rows
taskList.addEventListener('click', e => {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const li = btn.closest('.task');
  const task = state.tasks.find(t => t.id === li.dataset.id);
  if (!task) return;

  switch (btn.dataset.act) {
    case 'toggle':
      task.done = !task.done;
      ensureActiveTask();
      break;
    case 'select':
      if (!task.done) state.activeTask = task.id;
      break;
    case 'est-inc':
      task.est = Math.min(20, task.est + 1);
      break;
    case 'est-dec':
      task.est = Math.max(1, task.est - 1);
      break;
    case 'delete':
      state.tasks = state.tasks.filter(t => t.id !== task.id);
      ensureActiveTask();
      break;
  }
  renderTasks();
  render();
});

taskClear.addEventListener('click', () => {
  state.tasks = state.tasks.filter(t => !t.done);
  ensureActiveTask();
  renderTasks();
  render();
});

// ─── The greeting ─────────────────────────────────────────────
const WORDS = ['zero','one','two','three','four','five','six','seven','eight',
               'nine','ten','eleven','twelve'];

/** Small counts read better as words in a sentence than as digits. */
function numberWord(n) {
  return n >= 0 && n < WORDS.length ? WORDS[n] : String(n);
}

/** The count word often opens the greeting's second sentence. */
function sentenceCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function partOfDay() {
  const h = new Date().getHours();
  return h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening';
}

/**
 * The h1 names this person and today's one fact, taken from the data. It is
 * kept short so it still sets in two lines at every width; the detail and the
 * date go in the grey line underneath, never as an eyebrow above.
 */
function renderGreeting(running) {
  const part = partOfDay();
  const done = state.stats[todayKey()] || 0;
  const task = activeTask();

  let line;
  if (running && state.mode === 'focus' && task) {
    const short = task.text.length > 28 ? task.text.slice(0, 27).trimEnd() + '…' : task.text;
    line = `${part}. On ${short}`;
  } else if (running && state.mode === 'focus') {
    line = `${part}. The interval is running.`;
  } else if (running) {
    line = `${part}. Resting until the next one.`;
  } else if (done === 0) {
    line = `${part}. Ready when you are.`;
  } else if (done === 1) {
    line = `${part}. One interval done.`;
  } else {
    line = `${part}. ${sentenceCase(numberWord(done))} intervals done.`;
  }
  greetingText.textContent = line;

  const d = new Date();
  const date = d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  const mins = done * state.durations.focus;
  const fact = done === 0
    ? `the first interval is ${state.durations.focus} minutes`
    : `${mins} minute${mins === 1 ? '' : 's'} of focus so far`;
  greetingDate.textContent = `${date} · ${fact}`;
}

// ─── B9 inline form errors ────────────────────────────────────
function showTaskError(message) {
  taskError.textContent = message;
  taskError.hidden = false;
  taskInput.classList.add('has-error');
  taskInput.focus();
}

function clearTaskError() {
  taskError.textContent = '';
  taskError.hidden = true;
  taskInput.classList.remove('has-error');
}

taskInput.addEventListener('input', () => {
  if (!taskError.hidden) clearTaskError();
});

// ─── Primary button: swap icon and label together ─────────────
function setToggleBtn(iconId, label, ariaLabel) {
  toggleBtn.querySelector('use').setAttribute('href', iconId);
  toggleLabel.textContent = label;
  toggleBtn.setAttribute('aria-label', ariaLabel);
}

// ─── Theme ────────────────────────────────────────────────────
const THEME_KEY = 'ma_theme_v1';

function prefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** True when the page is currently rendering the dark palette. */
function isDark() {
  const set = document.documentElement.getAttribute('data-theme');
  return set ? set === 'dark' : prefersDark();
}

function syncThemeButton() {
  const dark = isDark();
  themeBtn.querySelector('use').setAttribute('href', dark ? '#i-sun' : '#i-moon');
  themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
}

themeBtn.addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* private mode */ }
  syncThemeButton();
});

// Follow the OS while the user has not chosen for themselves
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (!document.documentElement.hasAttribute('data-theme')) syncThemeButton();
});

syncThemeButton();

// ─── B7 scroll reveals ────────────────────────────────────────
/**
 * Sections rise 32px and fade in once as they enter the viewport. The hidden
 * state lives behind `.reveals-on`, added here, so a page whose script never
 * runs still shows everything.
 */
function armReveals() {
  document.querySelectorAll('.panel, .tile, .quote').forEach(el => el.classList.add('reveal'));
  const items = document.querySelectorAll('.reveal');
  if (!items.length || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('reveals-on');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target); // reveal once, never replay
    });
    /* The bottom margin is positive on purpose: a negative one would shrink the
       root above anything sitting in the last stretch of the document — the
       footer quote never reaches it at maximum scroll and stays hidden. */
  }, { rootMargin: '0px 0px 5% 0px', threshold: 0 });

  items.forEach(el => io.observe(el));
}

// ─── B11 tagline reveal, word by word ────────────────────────
/**
 * Each word carries its own observer and lights up as it crosses a trigger
 * line at 75% of the viewport height, with a short stagger so words on one
 * line still arrive in reading order rather than together. The line has to sit
 * low enough that the last line of the block can actually climb above it at the
 * document's maximum scroll, or those words would stay muted for good.
 */
function armTagline() {
  const el = document.getElementById('tagline-text');
  if (!el) return;

  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((word, i) => {
    const jp = /[\u3000-\u9FFF]/.test(word) ? ' jp' : '';
    const delay = Math.min(i * 40, 600);
    return `<span class="w${jp}" style="transition-delay:${delay}ms">${escapeHTML(word)}</span>`;
  }).join(' ');

  const spans = el.querySelectorAll('.w');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    spans.forEach(s => s.classList.add('is-on'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-on');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -25% 0px', threshold: 0 });

  spans.forEach(s => io.observe(s));
}

// ─── Init ─────────────────────────────────────────────────────
setInterval(showNextQuote, 180 * 1000);
showNextQuote();
ensureActiveTask();
renderTasks();
render();
armReveals();
armTagline();
