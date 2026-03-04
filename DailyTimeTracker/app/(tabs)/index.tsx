import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';

// Tell the app how to show notifications when app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const TASKS = [
  { id: '1', name: '🍳 Eat Breakfast',    startTime: '7:30 AM', duration: 1 },
  { id: '2', name: '🎒 Leave for School', startTime: '8:30 AM', duration: 1 },
  { id: '3', name: '🏫 Arrive at Class',  startTime: '9:00 AM', duration: 1 },
  { id: '4', name: '📚 Study Block',      startTime: '10:00 AM', duration: 1 },
];

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TASKS[0].duration * 60);
  const notificationListener = useRef<string>('');
  const [isPaused, setIsPaused] = useState(false);

  const currentTask = TASKS[currentIndex];
  const upcomingTasks = TASKS.slice(currentIndex + 1);

  // Ask for notification permission when app opens
  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Please enable notifications so we can remind you about your tasks!');
      }
    }
    requestPermissions();
  }, []);

  // Schedule a notification for the next task
  async function scheduleNextTaskNotification(taskName: string) {
    // Vibrate the phone - pattern is [wait, vibrate, wait, vibrate]
    Vibration.vibrate([0, 500, 200, 500]);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Time for your next task!',
        body: `Up next: ${taskName}`,
        sound: true,
      },
      trigger: { 
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, 
        seconds: 10, 
        repeats: false 
      },
    });
  }

  // Countdown timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          const nextIndex = Math.min(currentIndex + 1, TASKS.length - 1);
          setCurrentIndex(nextIndex);
          return TASKS[nextIndex].duration * 60;
        }
        return prev - 1;
      });
   }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  // Reset timer when task changes
  useEffect(() => {
    setSecondsLeft(TASKS[currentIndex].duration * 60);
  }, [currentIndex]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = 1 - secondsLeft / (currentTask.duration * 60);

  const handleDone = () => {
    if (currentIndex < TASKS.length - 1) {
      const nextTask = TASKS[currentIndex + 1];
      scheduleNextTaskNotification(nextTask.name);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    if (currentIndex < TASKS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <Text style={styles.header}>Daily Time Tracker</Text>
      <Text style={styles.subheader}>School Day Routine</Text>

      {/* Current Task */}
      <View style={styles.currentTaskBox}>
        <Text style={styles.nowLabel}>NOW</Text>
        <Text style={styles.taskName}>{currentTask.name}</Text>
        <Text style={styles.timer}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.buttonText}>✅ Mark Done</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pauseButton]}
          onPress={() => setIsPaused(!isPaused)}
        >
          <Text style={styles.buttonText}>{isPaused ? '▶️ Resume' : '⏸️ Pause'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.buttonText}>⏭️ Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Tasks */}
      <Text style={styles.upcomingLabel}>UPCOMING</Text>
      <FlatList
        data={upcomingTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.upcomingItem}>
            <Text style={styles.upcomingText}>{item.name}</Text>
            <Text style={styles.upcomingTime}>{item.startTime}</Text>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container:             { flex: 1, backgroundColor: '#f5f5f5', padding: 24, paddingTop: 60 },
  header:                { fontSize: 26, fontWeight: 'bold', color: '#333' },
  subheader:             { fontSize: 14, color: '#888', marginBottom: 24 },
  currentTaskBox:        { backgroundColor: '#fff', borderRadius: 16, padding: 24, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  nowLabel:              { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 4 },
  taskName:              { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  timer:                 { fontSize: 48, fontWeight: 'bold', color: '#4A90E2', textAlign: 'center', marginBottom: 16 },
  progressBarBackground: { height: 10, backgroundColor: '#eee', borderRadius: 5 },
  progressBarFill:       { height: 10, backgroundColor: '#4A90E2', borderRadius: 5 },
  buttonRow:             { flexDirection: 'row', gap: 12, marginBottom: 24 },
  doneButton:            { flex: 1, backgroundColor: '#4CAF50', padding: 14, borderRadius: 12, alignItems: 'center' },
  pauseButton:           { flex: 1, backgroundColor: '#2196F3', padding: 14, borderRadius: 12, alignItems: 'center' },
  skipButton:            { flex: 1, backgroundColor: '#FF9800', padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText:            { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  upcomingLabel:         { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 8 },
  upcomingItem:          { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  upcomingText:          { fontSize: 16, color: '#333' },
  upcomingTime:          { fontSize: 14, color: '#888' },
});