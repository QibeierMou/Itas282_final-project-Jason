import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('dailytimetracker.db');

// create tasks table if it doesn't exist
export function initDatabase() {
    db.execSync(
        `CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            duration INTEGER NOT NULL
        );`
    )
}

// Load all tasks from the database
export function loadTasks() {
    return db.getAllsync('SELECT * FROM tasks');
}

// add a new task to the database
export function addTask(task) {
    db.runSync(
    'INSERT INTO tasks (id, name, startTime, duration) VALUES (?, ?, ?, ?);',
    [task.id, task.name, task.startTime, task.duration]
  );
}

// Delete a task
export function deleteTask(id) {
  db.runSync('DELETE FROM tasks WHERE id = ?;', [id]);
}