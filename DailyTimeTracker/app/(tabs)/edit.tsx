import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { initDatabase, loadTasks, addTask, deleteTask } from '../../database';

const initialTasks = [
  { id: '1', name: '🍳 Eat Breakfast',    startTime: '7:30 AM', endTime: '8:00 AM', duration: '30' },
  { id: '2', name: '🎒 Leave for School', startTime: '8:30 AM', endTime: '8:40 AM', duration: '10' },
  { id: '3', name: '🏫 Arrive at Class',  startTime: '9:00 AM', endTime: '10:00 AM', duration: '60' },
  { id: '4', name: '📚 Study Block',      startTime: '10:00 AM', endTime: '11:00 AM', duration: '60' },
];

export default function EditScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newName, setNewName] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [newDuration, setNewDuration] = useState('');

  const handleAdd = () => {
    if (!newName || !newStartTime || !newEndTime || !newDuration) {
      Alert.alert('Missing Info', 'Please fill in all fields!');
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      name: newName,
      startTime: newStartTime,
      endTime: newEndTime,
      duration: newDuration,
    };
    setTasks([...tasks, newTask]);
    addTask(newTask);
    setNewName('');
    setNewStartTime('');
    setNewEndTime('');
    setNewDuration('');
    Alert.alert('Success', 'Task added successfully!');
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
              <Text style={styles.taskMeta}>
                {item.startTime} - {item.endTime} · {item.duration} min
              </Text>
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
        
        {/* Task Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Task Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 🚿 Shower, 🏃 Morning Jog, 📖 Read Book"
            value={newName}
            onChangeText={setNewName}
            placeholderTextColor="#999"
          />
        </View>

        {/* Time Range Inputs */}
        <View style={styles.timeRow}>
          <View style={styles.timeInputGroup}>
            <Text style={styles.label}>Start Time</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="e.g., 10:00 AM"
              value={newStartTime}
              onChangeText={setNewStartTime}
              placeholderTextColor="#999"
            />
          </View>

          <Text style={styles.timeSeparator}>→</Text>

          <View style={styles.timeInputGroup}>
            <Text style={styles.label}>End Time</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="e.g., 11:00 AM"
              value={newEndTime}
              onChangeText={setNewEndTime}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Duration Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 30, 45, 60"
            value={newDuration}
            onChangeText={setNewDuration}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        {/* Example Section */}
        <View style={styles.exampleBox}>
          <Text style={styles.exampleTitle}>💡 Example:</Text>
          <Text style={styles.exampleText}>
            <Text style={styles.exampleLabel}>Name:</Text> 🏋️ Gym Workout{'\n'}
            <Text style={styles.exampleLabel}>Time:</Text> 6:00 PM - 7:30 PM{'\n'}
            <Text style={styles.exampleLabel}>Duration:</Text> 90 minutes
          </Text>
        </View>

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>💾 Save Task</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#f5f5f5', padding: 24, paddingTop: 60 },
  header:         { fontSize: 26, fontWeight: 'bold', color: '#333' },
  subheader:      { fontSize: 14, color: '#888', marginBottom: 16 },
  
  // Task Item Styles
  taskItem:       { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  taskInfo:       { flex: 1 },
  taskName:       { fontSize: 16, fontWeight: 'bold', color: '#333' },
  taskMeta:       { fontSize: 13, color: '#888', marginTop: 4 },
  deleteButton:   { padding: 8 },
  deleteText:     { fontSize: 20 },
  
  // Form Styles
  form:           { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginTop: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  formTitle:      { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  
  // Input Group Styles
  inputGroup:     { marginBottom: 16 },
  label:          { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 6 },
  input:          { backgroundColor: '#f8f8f8', borderRadius: 10, padding: 14, fontSize: 15, borderWidth: 1, borderColor: '#e0e0e0' },
  
  // Time Row Styles
  timeRow:        { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  timeInputGroup: { flex: 1 },
  timeInput:      { backgroundColor: '#f8f8f8', borderRadius: 10, padding: 14, fontSize: 15, borderWidth: 1, borderColor: '#e0e0e0' },
  timeSeparator:  { fontSize: 20, color: '#4A90E2', marginHorizontal: 8, fontWeight: 'bold' },
  
  // Example Box Styles
  exampleBox:     { backgroundColor: '#FFF9E6', borderRadius: 10, padding: 14, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#FFD700' },
  exampleTitle:   { fontSize: 14, fontWeight: 'bold', color: '#D4A017', marginBottom: 6 },
  exampleText:    { fontSize: 13, color: '#666', lineHeight: 20 },
  exampleLabel:   { fontWeight: '600', color: '#555' },
  
  // Add Button Styles
  addButton:      { backgroundColor: '#4A90E2', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#4A90E2', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  addButtonText:  { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});