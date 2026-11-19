// Leonida Platinum: boot, render the checklist, wire the tracker controls.
// Loads app/data/trophies.json (a file of this app, never the network), keeps
// progress in localStorage, and honours shareable view links (?seed=demo,
// ?spoilers=on|off, ?grade=, ?kind=, ?q=, ?earned=, ?open=<id>).
import {
  loadProgress,
  saveProgress,
  loadSettings,
  saveSettings,
  exportProgress,
  parseImport,
  resetProgress,
} from './store.js';
import { KIND_LABELS, GRADE_LABELS, applyFilters, countByGrade, countByKind } from './filters.js';

const DEMO_EARNED = [2, 3, 8, 15, 16, 19, 20, 21, 32, 35, 42, 52, 53];
const HIDDEN_PLACEHOLDER = 'Hidden trophy — earn it to reveal';

const listEl = document.getElementById('list');
const emptyEl = document.getElementById('empty');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const kindEl = document.getElementById('kind');
const earnedFilterEl = document.getElementById('earnedFilter');
const missableEl = document.getElementById('missableOnly');
const spoilersEl = document.getElementById('spoilers');
const statusEl = document.getElementById('status');
const showingEl = document.getElementById('showing');

const params = new URLSearchParams(location.search);
const savedProgress = loadProgress();
let earned = savedProgress ?? new Set();
if (savedProgress === null && params.get('seed') === 'demo') {
  earned = new Set(DEMO_EARNED);
}
const savedSettings = loadSettings();
let spoilersOn = savedSettings.spoilers ?? true;
if (params.get('spoilers') === 'on') spoilersOn = true;
if (params.get('spoilers') === 'off') spoilersOn = false;
spoilersEl.checked = spoilersOn;
if (params.get('grade')) gradeEl.value = params.get('grade');
if (params.get('kind')) kindEl.value = params.get('kind');
if (params.get('q')) searchEl.value = params.get('q');
if (params.get('earned')) earnedFilterEl.value = params.get('earned');
const openId = Number(params.get('open') ?? 0) || null;

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

function shortHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function isMasked(trophy) {
  return trophy.hidden && spoilersOn && !earned.has(trophy.id);
}

function makeTag(text, className) {
  const span = document.createElement('span');
  span.className = `tag ${className}`;
  span.textContent = text;
  return span;
}

function renderCard(trophy) {
  const masked = isMasked(trophy);
  const isEarned = earned.has(trophy.id);
  const card = document.createElement('article');
  card.className = `card${isEarned ? ' earned' : ''}${masked ? ' hidden-masked' : ''}`;
  card.id = `trophy-${trophy.id}`;

  const top = document.createElement('div');
  top.className = 'card-top';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = isEarned;
  box.setAttribute('aria-label', `Mark ${masked ? 'hidden trophy' : trophy.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(trophy.id);
    else earned.delete(trophy.id);
    saveProgress(earned);
    render();
  });
  const head = document.createElement('div');
  const name = document.createElement('div');
  name.className = 'card-name';
  const num = document.createElement('span');
  num.className = 'num';
  num.textContent = `#${trophy.id} `;
  name.append(num, document.createTextNode(masked ? 'Hidden trophy' : trophy.name));
  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = masked ? HIDDEN_PLACEHOLDER : trophy.description;
  head.append(name, desc);
  top.append(box, head);
  card.append(top);

  const tags = document.createElement('div');
  tags.className = 'tags';
  tags.append(makeTag(GRADE_LABELS[trophy.grade], `grade-${trophy.grade}`));
  tags.append(makeTag(KIND_LABELS[trophy.kind] ?? trophy.kind, 'kind'));
  if (trophy.hidden) tags.append(makeTag('Hidden on PSN', 'hidden-tag'));
  if (trophy.missable) tags.append(makeTag('Potentially missable', 'missable'));
  if (trophy.guide.startsWith('UNCONFIRMED')) tags.append(makeTag('Method unconfirmed', 'unconfirmed'));
  if (isEarned) tags.append(makeTag('Earned', 'earned-tag'));
  card.append(tags);

  if (masked) {
    const note = document.createElement('p');
    note.className = 'guide';
    note.textContent = 'Its name, description and guide stay hidden until you earn it in the game — or switch the spoiler setting off above.';
    card.append(note);
    return card;
  }

  const details = document.createElement('details');
  details.className = 'details';
  if (openId === trophy.id) details.open = true;
  const summary = document.createElement('summary');
  summary.textContent = 'Guide & sources';
  const guide = document.createElement('p');
  guide.className = 'guide';
  guide.textContent = trophy.guide;
  const sources = document.createElement('p');
  sources.className = 'sources';
  sources.append(document.createTextNode('Sources: '));
  trophy.sources.forEach((url, index) => {
    if (index > 0) sources.append(document.createTextNode(' · '));
    const link = document.createElement('a');
    link.href = url;
    link.rel = 'noopener';
    link.textContent = shortHost(url);
    sources.append(link);
  });
  details.append(summary, guide, sources);
  card.append(details);
  return card;
}

function renderProgress() {
  const total = trophies.length;
  const count = earned.size;
  document.getElementById('earnedCount').textContent = String(count);
  const fill = document.getElementById('barFill');
  fill.style.width = `${Math.round((count / total) * 100)}%`;
  const barWrap = document.getElementById('barWrap');
  barWrap.setAttribute('aria-valuenow', String(count));
  barWrap.setAttribute('aria-valuetext', `${count} of ${total} earned`);
  const byGrade = countByGrade(trophies, earned);
  document.getElementById('gradeCounts').textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((grade) => `${GRADE_LABELS[grade]} ${byGrade[grade]?.earned ?? 0}/${byGrade[grade]?.total ?? 0}`)
    .join(' · ');
  const byKind = countByKind(trophies, earned);
  const kindParts = Object.keys(KIND_LABELS)
    .filter((kind) => (byKind[kind]?.earned ?? 0) > 0)
    .map((kind) => `${KIND_LABELS[kind]} ${byKind[kind].earned}/${byKind[kind].total}`);
  document.getElementById('kindCounts').textContent =
    kindParts.length > 0 ? kindParts.join(' · ') : 'Tick a trophy to start your count.';
}

function readFilters() {
  return {
    query: searchEl.value,
    grade: gradeEl.value,
    kind: kindEl.value,
    earnedFilter: earnedFilterEl.value,
    missableOnly: missableEl.checked,
  };
}

function render() {
  renderProgress();
  const shown = applyFilters(trophies, readFilters(), earned);
  listEl.replaceChildren(...shown.map(renderCard));
  emptyEl.hidden = shown.length > 0;
  showingEl.textContent = `Showing ${shown.length} of ${trophies.length} trophies`;
}

function setStatus(text) {
  statusEl.textContent = text;
}

searchEl.addEventListener('input', render);
gradeEl.addEventListener('change', render);
kindEl.addEventListener('change', render);
earnedFilterEl.addEventListener('change', render);
missableEl.addEventListener('change', render);
spoilersEl.addEventListener('change', () => {
  spoilersOn = spoilersEl.checked;
  saveSettings({ ...loadSettings(), spoilers: spoilersOn });
  render();
});

document.getElementById('export').addEventListener('click', () => {
  const count = exportProgress(earned);
  setStatus(`Exported ${count} earned ${count === 1 ? 'trophy' : 'trophies'} as gta6-trophy-progress.json.`);
});

document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const result = parseImport(await file.text());
  if (!result.ok) {
    setStatus(result.error);
    event.target.value = '';
    return;
  }
  earned = result.earned;
  saveProgress(earned);
  render();
  setStatus(`Imported ${earned.size} earned ${earned.size === 1 ? 'trophy' : 'trophies'} from ${file.name}.`);
  event.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (!window.confirm('Reset all progress? This clears every ticked trophy.')) return;
  earned = resetProgress();
  render();
  setStatus('Progress reset. Nothing is ticked.');
});

render();

// Jump to a hash target (#roadmap, #trophy-28) once the list exists.
if (location.hash) {
  const target = document.querySelector(location.hash);
  if (target) target.scrollIntoView();
}
window.__shotReady = true;
