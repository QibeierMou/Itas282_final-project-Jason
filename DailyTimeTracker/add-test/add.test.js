import { calculateDuration, validateTask } from '../utils/businessLogic';

describe('ADD - Time Calculation', () => {

  test('should calculate correct duration', () => {
    expect(calculateDuration('10:00', '11:00')).toBe(60);
  });

  test('should return null for invalid time', () => {
    expect(calculateDuration('11:00', '10:00')).toBe(null);
  });

});

describe('ADD - Task Management', () => {

  test('should accept valid task', () => {
    const task = {
      name: 'Study',
      duration: 5
    };

    expect(validateTask(task)).toBe(true);
  });

  test('should reject invalid task (missing name)', () => {
    const task = {
      duration: 5
    };

    expect(validateTask(task)).toBe(false);
  });

  test('should reject invalid task (zero duration)', () => {
    const task = {
      name: 'Test',
      duration: 0
    };

    expect(validateTask(task)).toBe(false);
  });

});