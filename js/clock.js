const callbacks = new Set();
let started = false;

export function onTick(callback) {
  callbacks.add(callback);
  return () => callbacks.delete(callback);
}

function tick() {
  const now = new Date();
  callbacks.forEach((callback) => callback(now));
  scheduleNext();
}

function scheduleNext() {
  const delay = 1000 - (Date.now() % 1000);
  setTimeout(tick, delay);
}

export function startClock() {
  if (started) return;
  started = true;
  tick();
}
