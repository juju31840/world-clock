const FAVORITES_KEY = 'worldclock.favorites';
const TIME_FORMAT_KEY = 'worldclock.timeFormat';

export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(ids) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    // localStorage indisponible (quota dépassé, navigation privée...) — on ignore
  }
}

export function getTimeFormat() {
  try {
    const value = localStorage.getItem(TIME_FORMAT_KEY);
    return value === '12h' || value === '24h' ? value : '24h';
  } catch {
    return '24h';
  }
}

export function saveTimeFormat(value) {
  try {
    localStorage.setItem(TIME_FORMAT_KEY, value);
  } catch {
    // idem
  }
}
