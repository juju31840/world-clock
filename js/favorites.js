import { getState, setState, emit } from './state.js';
import { getFavorites, saveFavorites } from './storage.js';

export function initFavorites() {
  setState({ favorites: new Set(getFavorites()) });
}

export function isFavorite(id) {
  return getState().favorites.has(id);
}

export function toggleFavorite(id) {
  const { favorites } = getState();
  if (favorites.has(id)) {
    favorites.delete(id);
  } else {
    favorites.add(id);
  }
  saveFavorites(Array.from(favorites));
  emit('favorites:change', id);
}
