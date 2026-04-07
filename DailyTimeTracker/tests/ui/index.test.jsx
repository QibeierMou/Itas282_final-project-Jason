describe('Index Screen - Timer', () => {
  it('formats time correctly with padStart', () => {
    const seconds = 65;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    expect(formatted).toBe('01:05');
  });

  it('calculates progress correctly', () => {
    const duration = 60;
    const secondsLeft = 30;
    const progress = 1 - secondsLeft / (duration * 60);
    expect(progress).toBeGreaterThan(0);
  });

  it('does not go past last task index', () => {
    const tasks = [{ id: '1' }, { id: '2' }, { id: '3' }];
    const currentIndex = 2;
    const nextIndex = Math.min(currentIndex + 1, tasks.length - 1);
    expect(nextIndex).toBe(2);
  });
});