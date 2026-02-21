export function addTimes(a, b) {
    return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function secondsToMinutes(seconds) {
  return seconds / 60;
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs}`;
}

export function reset() {
  return 0;
}