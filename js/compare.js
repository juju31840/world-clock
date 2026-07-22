import { getState, setState, on, emit } from './state.js';
import { getFormatter, getDateFormatter, getOffsetLabel } from './formatters.js';
import { onTick } from './clock.js';
import { createFlagElement } from './flag.js';

const MAX_COMPARE = 3;

export function isSelected(id) {
  return getState().compareSelection.includes(id);
}

export function canAddMore() {
  return getState().compareSelection.length < MAX_COMPARE;
}

export function toggleCompare(id) {
  const { compareSelection } = getState();
  let next;
  if (compareSelection.includes(id)) {
    next = compareSelection.filter((x) => x !== id);
  } else {
    if (compareSelection.length >= MAX_COMPARE) return false;
    next = [...compareSelection, id];
  }
  setState({ compareSelection: next });
  emit('compare:change', next);
  return true;
}

let panelEl;
let cardsContainerEl;
let entriesById;

function createCard(entry) {
  const card = document.createElement('div');
  card.className = 'compare-card';
  card.dataset.id = entry.id;
  card.title = `${entry.label} (${entry.id})`;

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'compare-card__remove';
  removeBtn.textContent = '✕';
  removeBtn.setAttribute('aria-label', `Retirer ${entry.label} du comparateur`);
  removeBtn.addEventListener('click', () => toggleCompare(entry.id));

  const title = document.createElement('div');
  title.className = 'compare-card__title';

  const flagEl = createFlagElement(entry, 'compare-card__flag');

  const labelEl = document.createElement('span');
  labelEl.className = 'compare-card__title-text';
  labelEl.textContent = entry.label;

  title.append(flagEl, labelEl);

  const idLine = document.createElement('div');
  idLine.className = 'compare-card__id';
  idLine.textContent = entry.id;

  const time = document.createElement('div');
  time.className = 'compare-card__time';

  const date = document.createElement('div');
  date.className = 'compare-card__date';

  const offset = document.createElement('div');
  offset.className = 'compare-card__offset';

  card.append(removeBtn, title, idLine, time, date, offset);

  return { card, time, date, offset };
}

function renderPanel() {
  const { compareSelection } = getState();
  cardsContainerEl.innerHTML = '';
  panelEl.classList.toggle('hidden', compareSelection.length === 0);

  const now = new Date();
  for (const id of compareSelection) {
    const entry = entriesById.get(id);
    if (!entry) continue;
    const { card, time, date, offset } = createCard(entry);
    updateCard(id, time, date, offset, now);
    cardsContainerEl.appendChild(card);
  }
}

function updateCard(id, timeEl, dateEl, offsetEl, now) {
  const { timeFormat } = getState();
  timeEl.textContent = getFormatter(id, timeFormat).format(now);
  dateEl.textContent = getDateFormatter(id).format(now);
  offsetEl.textContent = getOffsetLabel(id, now);
}

function updatePanelTimes(now) {
  const { compareSelection } = getState();
  if (compareSelection.length === 0) return;
  for (const id of compareSelection) {
    const card = cardsContainerEl.querySelector(`.compare-card[data-id="${id}"]`);
    if (!card) continue;
    updateCard(
      id,
      card.querySelector('.compare-card__time'),
      card.querySelector('.compare-card__date'),
      card.querySelector('.compare-card__offset'),
      now
    );
  }
}

export function initCompare({ panelEl: panel, cardsContainerEl: container, timezones }) {
  panelEl = panel;
  cardsContainerEl = container;
  entriesById = new Map(timezones.map((tz) => [tz.id, tz]));

  renderPanel();

  on('compare:change', renderPanel);
  on('format:change', () => updatePanelTimes(new Date()));
  onTick((now) => updatePanelTimes(now));
}
