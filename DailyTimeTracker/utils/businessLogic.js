export function calculateDuration(start, end) {
  const startTime = new Date(`2024-01-01 ${start}`);
  const endTime = new Date(`2024-01-01 ${end}`);

  if (endTime <= startTime) {
    return null; // invalid time
  }

  const diff = (endTime - startTime) / 60000; // minutes
  return diff;
}

export function validateTask(task) {
  return !!(task.name && task.duration > 0);
}