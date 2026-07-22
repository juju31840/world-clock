const state = {
  timezones: [],
  searchQuery: '',
  favorites: new Set(),
  compareSelection: [],
  timeFormat: '24h',
};

const listeners = new Map();

export function getState() {
  return state;
}

export function setState(patch) {
  Object.assign(state, patch);
}

export function on(event, callback) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event).add(callback);
  return () => listeners.get(event).delete(callback);
}

export function emit(event, payload) {
  const callbacks = listeners.get(event);
  if (callbacks) {
    callbacks.forEach((callback) => callback(payload));
  }
}
