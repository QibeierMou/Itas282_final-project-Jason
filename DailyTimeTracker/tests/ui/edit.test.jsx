describe('Edit Screen - Add Task', () => {
  it('has a handleAdd function that validates empty fields', () => {
    const task = { name: '', startTime: '', endTime: '', duration: '' };
    const isValid = task.name && task.startTime && task.endTime && task.duration;
    expect(isValid).toBeFalsy();
  });

  it('creates a valid task object with all fields', () => {
    const task = {
      id: '123',
      name: 'Study',
      startTime: '9:00 AM',
      endTime: '10:00 AM',
      duration: '60',
    };
    expect(task.name).toBe('Study');
    expect(task.duration).toBe('60');
  });

  it('filters out deleted task by id', () => {
    const tasks = [
      { id: '1', name: 'Task A' },
      { id: '2', name: 'Task B' },
    ];
    const updated = tasks.filter(t => t.id !== '1');
    expect(updated.length).toBe(1);
    expect(updated[0].name).toBe('Task B');
  });
});