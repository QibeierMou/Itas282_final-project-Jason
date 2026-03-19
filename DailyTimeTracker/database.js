import * as SQLite from 'expo-sqlite';

// Open database using the new synchronous API
const db = SQLite.openDatabaseSync('dailytimetracker.db');

// Create tasks table if it doesn't exist
export function initDatabase() {
  try {
    db.execSync(
      `CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        duration INTEGER NOT NULL,
        startTime TEXT,
        endTime TEXT
      );`
    );
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// Load all tasks from the database
export function loadTasks() {
  try {
    const result = db.getAllSync('SELECT * FROM tasks');
    console.log('✅ Tasks loaded:', result.length);
    return result;
  } catch (error) {
    console.error('❌ Error loading tasks:', error);
    return [];
  }
}

export function addTask(task) {
  try {
    const statement = db.prepareSync(
      'INSERT INTO tasks (id, name, startTime, duration) VALUES (?, ?, ?, ?)'
    );
    
    // Format time range if both start and end times are provided
    const timeRange = task.startTime && task.endTime 
      ? `${task.startTime} - ${task.endTime}`
      : task.startTime || null;
    
    statement.executeSync([
      task.id,
      task.name,
      timeRange,
      task.duration || 0
    ]);
    
    console.log('✅ Task added:', task.name, timeRange);
    return true;
  } catch (error) {
    console.error('❌ Error adding task:', error);
    return false;
  }
}

// Update an existing task
export function updateTask(id, updates) {
  try {
    const statement = db.prepareSync(
      'UPDATE tasks SET duration = ?, startTime = ? WHERE id = ?'
    );
    
    statement.executeSync([
      updates.duration,
      updates.startTime || null,
      id
    ]);
    
    console.log('✅ Task updated:', id);
    return true;
  } catch (error) {
    console.error('❌ Error updating task:', error);
    return false;
  }
}

// Delete a task
export function deleteTask(id) {
  try {
    const statement = db.prepareSync('DELETE FROM tasks WHERE id = ?');
    statement.executeSync([id]);
    console.log('✅ Task deleted:', id);
    return true;
  } catch (error) {
    console.error('❌ Error deleting task:', error);
    return false;
  }
}

// Get total duration for a specific activity name
export function getTotalDuration(activityName) {
  try {
    const result = db.getAllSync(
      'SELECT SUM(duration) as total FROM tasks WHERE name = ?',
      [activityName]
    );
    return result[0]?.total || 0;
  } catch (error) {
    console.error('❌ Error getting total duration:', error);
    return 0;
  }
}

// Clear all tasks (reset functionality)
export function clearAllTasks() {
  try {
    db.execSync('DELETE FROM tasks');
    console.log('✅ All tasks cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing tasks:', error);
    return false;
  }
}

// Get all activities with their total durations
export function getAllActivityTotals() {
  try {
    const result = db.getAllSync(
      'SELECT name, SUM(duration) as total FROM tasks GROUP BY name'
    );
    
    const totals = {};
    result.forEach(row => {
      totals[row.name] = row.total;
    });
    
    return totals;
  } catch (error) {
    console.error('❌ Error getting activity totals:', error);
    return {};
  }
}

// Get a specific task by ID
export function getTask(id) {
  try {
    const result = db.getAllSync('SELECT * FROM tasks WHERE id = ?', [id]);
    return result[0] || null;
  } catch (error) {
    console.error('❌ Error getting task:', error);
    return null;
  }
}