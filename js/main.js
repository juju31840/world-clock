import { setState, getState } from './state.js';
import { buildTimezoneEntries } from './timezones.js';
import { initFavorites } from './favorites.js';
import { initSettings, toggleTimeFormat } from './settings.js';
import { initSearch } from './search.js';
import { initList } from './list.js';
import { initCompare } from './compare.js';
import { startClock } from './clock.js';

function init() {
  const timezones = buildTimezoneEntries();
  setState({ timezones });

  initFavorites();
  initSettings();

  const searchInput = document.getElementById('search-input');
  initSearch(searchInput);

  initList({
    favoritesListEl: document.getElementById('favorites-list'),
    allListEl: document.getElementById('timezones-list'),
    favoritesSectionEl: document.getElementById('favorites-section'),
    noResultsEl: document.getElementById('no-results'),
  });

  initCompare({
    panelEl: document.getElementById('compare-panel'),
    cardsContainerEl: document.getElementById('compare-cards'),
    timezones,
  });

  const formatToggleBtn = document.getElementById('format-toggle');
  formatToggleBtn.textContent = getState().timeFormat;
  formatToggleBtn.addEventListener('click', () => {
    formatToggleBtn.textContent = toggleTimeFormat();
  });

  startClock();
}

init();
