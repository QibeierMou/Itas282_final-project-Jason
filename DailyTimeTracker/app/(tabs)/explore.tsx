import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
  Platform,
  TextInput,
  Modal
} from 'react-native';
import * as Location from 'expo-location';
import { addTask } from '../../database';

// ✅ Conditional import (IMPORTANT FIX)
let MapView: any = null;
let Marker: any = null;
let Polyline: any = null;
let PROVIDER_GOOGLE: any = null;

if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  Polyline = maps.Polyline;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
}

type Coordinate = { latitude: number; longitude: number; };

type RouteLocation = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  time: string;
  activity: string;
};

const initialLocations: RouteLocation[] = [
  { id: '1', name: '🏠 Home', address: '123 Main St', latitude: 49.1659, longitude: -123.9407, time: '7:00 AM', activity: 'Wake up' },
  { id: '2', name: '🏫 School', address: 'Vancouver Island University', latitude: 49.1642, longitude: -123.9487, time: '9:00 AM', activity: 'Classes' },
  { id: '3', name: '🏋️ Gym', address: 'Nanaimo Athletic Club', latitude: 49.1650, longitude: -123.9420, time: '4:00 PM', activity: 'Workout' },
  { id: '4', name: '🍔 Restaurant', address: 'Downtown Nanaimo', latitude: 49.1658, longitude: -123.9365, time: '6:00 PM', activity: 'Dinner' },
];

export default function ExploreScreen() {
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const [routineLocations, setRoutineLocations] = useState<RouteLocation[]>(initialLocations);
  const [nextDestination, setNextDestination] = useState<RouteLocation>(initialLocations[0]);
  const [destinationIndex, setDestinationIndex] = useState<number>(0);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPinLocation, setNewPinLocation] = useState<Coordinate | null>(null);
  const [newPinName, setNewPinName] = useState('');
  const [newPinTime, setNewPinTime] = useState('');
  const [newPinActivity, setNewPinActivity] = useState('');

  // Get current location
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') {
        setCurrentLocation({ latitude: 49.1659, longitude: -123.9407 });
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    })();
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  useEffect(() => {
    if (currentLocation && nextDestination) {
      const dist = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        nextDestination.latitude,
        nextDestination.longitude
      );

      setDistance(dist);
      setDuration(Math.round((parseFloat(dist) / 5) * 60));

      setRouteCoordinates([
        currentLocation,
        { latitude: nextDestination.latitude, longitude: nextDestination.longitude }
      ]);
    }
  }, [currentLocation, nextDestination]);

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setNewPinLocation({ latitude, longitude });
    setShowAddModal(true);
  };

  const handleSavePin = () => {
    if (!newPinName || !newPinTime || !newPinActivity || !newPinLocation) {
      Alert.alert('Missing Info', 'Please fill in all fields!');
      return;
    }

    const newLocation: RouteLocation = {
      id: Date.now().toString(),
      name: newPinName,
      address: 'Custom Location',
      latitude: newPinLocation.latitude,
      longitude: newPinLocation.longitude,
      time: newPinTime,
      activity: newPinActivity,
    };

    setRoutineLocations([...routineLocations, newLocation]);

    addTask({
      id: newLocation.id,
      name: newLocation.name,
      startTime: newLocation.time,
      endTime: '',
      duration: 0
    });

    setNewPinName('');
    setNewPinTime('');
    setNewPinActivity('');
    setShowAddModal(false);

    Alert.alert('Success', `${newPinName} added!`);
  };

  const handleNextDestination = () => {
    const newIndex = (destinationIndex + 1) % routineLocations.length;
    setDestinationIndex(newIndex);
    setNextDestination(routineLocations[newIndex]);
  };

  return (
    <View style={styles.container}>

      {/* ✅ WEB SAFE PLACEHOLDER */}
      {Platform.OS === 'web' ? (
        <View style={styles.webMapPlaceholder} testID="map-container">
          <Text style={styles.webPlaceholderEmoji}>🗺️</Text>
          <Text style={styles.webPlaceholderTitle}>GPS Navigation</Text>
          <Text style={styles.webPlaceholderText}>
            Map view available on mobile. Use Expo Go to see interactive map.
          </Text>
        </View>
      ) : (
        // ✅ MOBILE MAP ONLY
        currentLocation && MapView && (
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            showsUserLocation
            onPress={handleMapPress}
            testID="map-container"
          >
            <Marker coordinate={currentLocation} title="You are here" />
            <Marker coordinate={nextDestination} title={nextDestination.name} />
            {routeCoordinates.length > 0 && (
              <Polyline coordinates={routeCoordinates} strokeWidth={4} />
            )}
          </MapView>
        )
      )}

      {/* Banner */}
      <View style={styles.instructionBanner}>
        <Text style={styles.instructionText}>
          {Platform.OS === 'web'
            ? '📱 View on mobile for map'
            : '📍 Tap map to add location'}
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f4f8',
    padding: 40
  },
  webPlaceholderEmoji: { fontSize: 80, marginBottom: 20 },
  webPlaceholderTitle: { fontSize: 28, fontWeight: 'bold' },
  webPlaceholderText: { fontSize: 16, textAlign: 'center' },

  instructionBanner: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  instructionText: { fontWeight: 'bold' }
});