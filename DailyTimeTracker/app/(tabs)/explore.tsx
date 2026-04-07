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

// ✅ TYPES
type Coordinate = {
  latitude: number;
  longitude: number;
};

type RouteLocation = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  time: string;
  activity: string;
};

// ✅ Lazy load maps (IMPORTANT)
let MapView: any, Marker: any, Polyline: any, PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Polyline = Maps.Polyline;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

export default function ExploreScreen() {

  const initialLocations: RouteLocation[] = [
    { id: '1', name: '🏠 Home', address: '123 Main St', latitude: 49.1659, longitude: -123.9407, time: '7:00 AM', activity: 'Wake up' },
    { id: '2', name: '🏫 School', address: 'Vancouver Island University', latitude: 49.1642, longitude: -123.9487, time: '9:00 AM', activity: 'Classes' },
    { id: '3', name: '🏋️ Gym', address: 'Nanaimo Athletic Club', latitude: 49.1650, longitude: -123.9420, time: '4:00 PM', activity: 'Workout' },
    { id: '4', name: '🍔 Restaurant', address: 'Downtown Nanaimo', latitude: 49.1658, longitude: -123.9365, time: '6:00 PM', activity: 'Dinner' },
  ];

  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const [routineLocations, setRoutineLocations] = useState<RouteLocation[]>(initialLocations);
  const [nextDestination, setNextDestination] = useState<RouteLocation>(initialLocations[0]);
  const [destinationIndex, setDestinationIndex] = useState<number>(0);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  // 📍 Get location
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

  return (
    <View style={styles.container}>

      {/* ✅ WEB SAFE (NO MAP LOADED) */}
      {Platform.OS === 'web' ? (
        <View style={styles.webMapPlaceholder} testID="map-container">
          <Text style={styles.webPlaceholderEmoji}>🗺️</Text>
          <Text style={styles.webPlaceholderTitle}>GPS Navigation</Text>
          <Text style={styles.webPlaceholderText}>
            Map only works on mobile
          </Text>
        </View>
      ) : (
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
          >
            <Marker coordinate={currentLocation} title="You are here" />
          </MapView>
        )
      )}

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