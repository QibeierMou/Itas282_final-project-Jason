import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { initDatabase, loadTasks, addTask, deleteTask } from '../../database';

const initialTasks = [
  { id: '1', name: '🍳 Eat Breakfast',    startTime: '7:30 AM', duration: '30' },
  { id: '2', name: '🎒 Leave for School', startTime: '8:30 AM', duration: '10' },
  { id: '3', name: '🏫 Arrive at Class',  startTime: '9:00 AM', duration: '60' },
  { id: '4', name: '📚 Study Block',      startTime: '10:00 AM', duration: '60' },
];

export default function EditScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newName, setNewName] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDuration, setNewDuration] = useState('');

  const handleAdd = () => {
    if (!newName || !newTime || !newDuration) {
      Alert.alert('Missing info', 'Please fill in all fields!');
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      name: newName,
      startTime: newTime,
      duration: newDuration,
    };
    setTasks([...tasks, newTask]);
    addTask(newTask);
    setNewName('');
    setNewTime('');
    setNewDuration('');
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
            setTasks(tasks.filter(t => t.id !== id));
            deleteTask(id);
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Routine</Text>
      <Text style={styles.subheader}>School Day</Text>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <View style={styles.taskInfo}>
              <Text style={styles.taskName}>{item.name}</Text>
              <Text style={styles.taskMeta}>{item.startTime} · {item.duration} min</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Add Task Form */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>➕ Add New Task</Text>
        <TextInput
          style={styles.input}
          placeholder="Task name (e.g. 🚿 Shower)"
          value={newName}
          onChangeText={setNewName}
        />
        <TextInput
          style={styles.input}
          placeholder="Start time (e.g. 7:00 AM)"
          value={newTime}
          onChangeText={setNewTime}
        />
        <TextInput
          style={styles.input}
          placeholder="Duration in minutes (e.g. 20)"
          value={newDuration}
          onChangeText={setNewDuration}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Save Task</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#f5f5f5', padding: 24, paddingTop: 60 },
  header:         { fontSize: 26, fontWeight: 'bold', color: '#333' },
  subheader:      { fontSize: 14, color: '#888', marginBottom: 16 },
  taskItem:       { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  taskInfo:       { flex: 1 },
  taskName:       { fontSize: 16, fontWeight: 'bold', color: '#333' },
  taskMeta:       { fontSize: 13, color: '#888', marginTop: 2 },
  deleteButton:   { padding: 8 },
  deleteText:     { fontSize: 20 },
  form:           { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 8 },
  formTitle:      { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  input:          { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 15 },
  addButton:      { backgroundColor: '#4A90E2', borderRadius: 12, padding: 14, alignItems: 'center' },
  addButtonText:  { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});