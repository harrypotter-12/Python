import { hydrate, initialState } from './model.js';

export const STORAGE_KEY = 'whim.v1';

export function loadState(now = new Date()) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState(now);
    return hydrate(JSON.parse(raw), now);
  } catch {
    return initialState(now);
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
