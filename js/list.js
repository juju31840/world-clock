import { getState, on } from './state.js';
import { getFormatter, getOffsetLabel } from './formatters.js';
import { isFavorite, toggleFavorite } from './favorites.js';
import { isSelected, toggleCompare, canAddMore } from './compare.js';
import { matchesQuery } from './search.js';
import { onTick } from './clock.js';
import { createFlagElement } from './flag.js';

const REGION_LABELS = {
  Africa: 'Afrique',
  America: 'Amérique',
  Antarctica: 'Antarctique',
  Asia: 'Asie',
  Atlantic: 'Atlantique',
  Australia: 'Australie',
  Europe: 'Europe',
  Indian: 'Océan Indien',
  Pacific: 'Pacifique',
  Etc: 'Autres (UTC)',
};

const nodeRefs = new Map();

let favoritesListEl;
let allListEl;
let favoritesSectionEl;
let noResultsEl;

function createSeparator(region) {
  const el = document.createElement('div');
  el.className = 'tz-list__separator';
  el.textContent = REGION_LABELS[region] || region;
  return el;
}

function createRow(entry) {
  const row = document.createElement('div');
  row.className = 'tz-row';
  row.dataset.id = entry.id;
  row.title = `${entry.label} (${entry.id})`;

  const flagEl = createFlagElement(entry, 'tz-row__flag');

  const info = document.createElement('div');
  info.className = 'tz-row__info';

  const cityEl = document.createElement('span');
  cityEl.className = 'tz-row__city';
  cityEl.textContent = entry.label;

  const idEl = document.createElement('span');
  idEl.className = 'tz-row__id';
  idEl.textContent = entry.id;

  info.append(cityEl, idEl);

  const timeWrap = document.createElement('div');
  timeWrap.className = 'tz-row__time-wrap';

  const timeEl = document.createElement('span');
  timeEl.className = 'tz-row__time';

  const offsetEl = document.createElement('span');
  offsetEl.className = 'tz-row__offset';

  timeWrap.append(timeEl, offsetEl);

  const actions = document.createElement('div');
  actions.className = 'tz-row__actions';

  const compareBtn = document.createElement('button');
  compareBtn.type = 'button';
  compareBtn.className = 'tz-row__compare-btn';
  compareBtn.setAttribute('aria-label', `Ajouter ${entry.label} au comparateur`);
  compareBtn.addEventListener('click', () => toggleCompare(entry.id));

  const starBtn = document.createElement('button');
  starBtn.type = 'button';
  starBtn.className = 'tz-row__star-btn';
  starBtn.setAttribute('aria-label', `Épingler ${entry.label}`);
  starBtn.addEventListener('click', () => toggleFavorite(entry.id));

  actions.append(compareBtn, starBtn);

  row.append(flagEl, info, timeWrap, actions);

  return { row, timeEl, offsetEl, compareBtn, starBtn };
}

function updateRowVisualState(id) {
  const refs = nodeRefs.get(id);
  if (!refs) return;
  const favorited = isFavorite(id);
  const selected = isSelected(id);
  refs.starBtn.textContent = favorited ? '★' : '☆';
  refs.starBtn.classList.toggle('is-active', favorited);
  refs.compareBtn.textContent = selected ? '✓' : '+';
  refs.compareBtn.classList.toggle('is-active', selected);
  refs.compareBtn.disabled = !selected && !canAddMore();
}

function updateRowTime(id, now) {
  const refs = nodeRefs.get(id);
  if (!refs) return;
  const { timeFormat } = getState();
  refs.timeEl.textContent = getFormatter(id, timeFormat).format(now);
  refs.offsetEl.textContent = getOffsetLabel(id, now);
}

export function updateAllRows(now = new Date()) {
  for (const id of nodeRefs.keys()) {
    updateRowTime(id, now);
  }
}

function updateSeparatorVisibility() {
  let currentSeparator = null;
  let groupHasVisibleRow = false;
  for (const child of allListEl.children) {
    if (child.classList.contains('tz-list__separator')) {
      if (currentSeparator) {
        currentSeparator.classList.toggle('hidden', !groupHasVisibleRow);
      }
      currentSeparator = child;
      groupHasVisibleRow = false;
    } else if (!child.classList.contains('hidden')) {
      groupHasVisibleRow = true;
    }
  }
  if (currentSeparator) {
    currentSeparator.classList.toggle('hidden', !groupHasVisibleRow);
  }
}

function applySearchFilter() {
  const { searchQuery, timezones } = getState();
  let visibleCount = 0;
  for (const entry of timezones) {
    const refs = nodeRefs.get(entry.id);
    if (!refs) continue;
    const visible = matchesQuery(entry, searchQuery);
    refs.row.classList.toggle('hidden', !visible);
    if (visible) visibleCount += 1;
  }
  noResultsEl.classList.toggle('hidden', visibleCount > 0);
  updateSeparatorVisibility();
}

function findInsertionAnchor(entry) {
  const { timezones } = getState();
  const index = timezones.indexOf(entry);
  for (let i = index + 1; i < timezones.length; i += 1) {
    const nextRefs = nodeRefs.get(timezones[i].id);
    if (nextRefs && nextRefs.row.parentElement === allListEl) {
      return nextRefs.row;
    }
  }
  return null;
}

function moveRowToSection(id) {
  const refs = nodeRefs.get(id);
  if (!refs) return;

  if (isFavorite(id)) {
    favoritesListEl.appendChild(refs.row);
  } else {
    const entry = getState().timezones.find((e) => e.id === id);
    const anchor = entry ? findInsertionAnchor(entry) : null;
    if (anchor) {
      allListEl.insertBefore(refs.row, anchor);
    } else {
      allListEl.appendChild(refs.row);
    }
  }

  favoritesSectionEl.classList.toggle('hidden', getState().favorites.size === 0);
  updateSeparatorVisibility();
}

export function initList({ favoritesListEl: favEl, allListEl: allEl, favoritesSectionEl: favSecEl, noResultsEl: noResEl }) {
  favoritesListEl = favEl;
  allListEl = allEl;
  favoritesSectionEl = favSecEl;
  noResultsEl = noResEl;

  const { timezones } = getState();

  let lastRegion = null;
  for (const entry of timezones) {
    if (entry.region !== lastRegion) {
      allListEl.appendChild(createSeparator(entry.region));
      lastRegion = entry.region;
    }

    const refs = createRow(entry);
    nodeRefs.set(entry.id, refs);
    updateRowVisualState(entry.id);
    const target = isFavorite(entry.id) ? favoritesListEl : allListEl;
    target.appendChild(refs.row);
  }

  favoritesSectionEl.classList.toggle('hidden', getState().favorites.size === 0);
  updateSeparatorVisibility();

  updateAllRows();

  onTick((now) => updateAllRows(now));

  on('search:change', applySearchFilter);
  on('favorites:change', (id) => {
    updateRowVisualState(id);
    moveRowToSection(id);
  });
  on('compare:change', () => {
    for (const id of nodeRefs.keys()) updateRowVisualState(id);
  });
  on('format:change', () => updateAllRows(new Date()));
}
