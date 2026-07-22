import { getState, setState, emit } from './state.js';
import { getTimeFormat, saveTimeFormat } from './storage.js';

export function initSettings() {
  setState({ timeFormat: getTimeFormat() });
}

export function setTimeFormat(value) {
  setState({ timeFormat: value });
  saveTimeFormat(value);
  emit('format:change', value);
}

export function toggleTimeFormat() {
  const next = getState().timeFormat === '24h' ? '12h' : '24h';
  setTimeFormat(next);
  return next;
}
