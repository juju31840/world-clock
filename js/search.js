import { setState, emit } from './state.js';

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesQuery(entry, query) {
  const tokens = normalize(query).split(' ').filter(Boolean);
  if (tokens.length === 0) return true;
  return tokens.every((token) => entry.searchText.includes(token));
}

export function setSearchQuery(query) {
  setState({ searchQuery: query });
  emit('search:change', query);
}

export function initSearch(inputEl) {
  inputEl.addEventListener('input', (event) => {
    setSearchQuery(event.target.value);
  });
}
