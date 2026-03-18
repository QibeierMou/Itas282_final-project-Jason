import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Linking, Platform, TextInput, Modal } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { addTask } from '../../database';

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


// Sample starting locations for your daily routine
const initialLocations = [
  {
    id: '1',
    name: '🏠 Home',
    address: '123 Main St',
    latitude: 49.1659,
    longitude: -123.9407,
    time: '7:00 AM',
    activity: 'Wake up'
  },
  {
    id: '2',
    name: '🏫 School',
    address: 'Vancouver Island University',
    latitude: 49.1642,
    longitude: -123.9487,
    time: '9:00 AM',
    activity: 'Classes'
  },
  {
    id: '3',
    name: '🏋️ Gym',
    address: 'Nanaimo Athletic Club',
    latitude: 49.1650,
    longitude: -123.9420,
    time: '4:00 PM',
    activity: 'Workout'
  },
  {
    id: '4',
    name: '🍔 Restaurant',
    address: 'Downtown Nanaimo',
    latitude: 49.1658,
    longitude: -123.9365,
    time: '6:00 PM',
    activity: 'Dinner'
  },
];

export default function ExploreScreen() {
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const [routineLocations, setRoutineLocations] = useState<RouteLocation[]>(initialLocations);
  const [nextDestination, setNextDestination] = useState<RouteLocation>(routineLocations[0]);
  const [destinationIndex, setDestinationIndex] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  
  // For adding custom pins
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPinLocation, setNewPinLocation] = useState<Coordinate | null>(null);
  const [newPinName, setNewPinName] = useState('');
  const [newPinTime, setNewPinTime] = useState('');
  const [newPinActivity, setNewPinActivity] = useState('');

  // Request location permissions and get current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for navigation');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(2); // in km
  };

  // Update distance and duration when destination changes
  useEffect(() => {
    if (currentLocation && nextDestination) {
      const dist = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        nextDestination.latitude,
        nextDestination.longitude
      );
      setDistance(dist);
      
      // Estimate duration (assuming 5 km/h walking or 40 km/h driving)
      const durationMin = Math.round((parseFloat(dist) / 5) * 60); // walking
      setDuration(durationMin);

      // Create route line
      setRouteCoordinates([
        currentLocation,
        {
          latitude: nextDestination.latitude,
          longitude: nextDestination.longitude,
        }
      ]);
    }
  }, [currentLocation, nextDestination]);

  // Handle map press to add new pin
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setNewPinLocation({ latitude, longitude });
    setShowAddModal(true);
  };

  // Save new custom pin
  const handleSavePin = () => {
    if (!newPinName || !newPinTime || !newPinActivity) {
      Alert.alert('Missing Info', 'Please fill in all fields!');
      return;
    }

    const newLocation = {
      id: Date.now().toString(),
      name: newPinName,
      address: 'Custom Location',
      latitude: newPinLocation.latitude,
      longitude: newPinLocation.longitude,
      time: newPinTime,
      activity: newPinActivity,
    };

    // Add to locations list
    setRoutineLocations([...routineLocations, newLocation]);
    
    // Save to database
    addTask({
      id: newLocation.id,
      name: newLocation.name,
      startTime: newLocation.time,
      duration: 0,
    });

    // Reset form
    setNewPinName('');
    setNewPinTime('');
    setNewPinActivity('');
    setShowAddModal(false);
    
    Alert.alert('Success', `${newPinName} added to your route!`);
  };

  // Delete a custom pin
  const handleDeletePin = (id) => {
    Alert.alert(
      'Delete Location',
      'Remove this location from your route?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setRoutineLocations(routineLocations.filter(loc => loc.id !== id));
            if (nextDestination.id === id && routineLocations.length > 1) {
              setNextDestination(routineLocations[0]);
              setDestinationIndex(0);
            }
          }
        }
      ]
    );
  };

  // Go to next destination
  const handleNextDestination = () => {
    const newIndex = (destinationIndex + 1) % routineLocations.length;
    setDestinationIndex(newIndex);
    setNextDestination(routineLocations[newIndex]);
    Alert.alert('Next Stop', `Navigating to: ${routineLocations[newIndex].name}`);
  };

  // Open navigation in Google Maps or Apple Maps
  const openInMaps = () => {
    const { latitude, longitude, name } = nextDestination;
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q='
    });
    const latLng = `${latitude},${longitude}`;
    const label = name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);
  };

  // Get directions
  const getDirections = () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Current location not available');
      return;
    }

    const { latitude, longitude } = nextDestination;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${latitude},${longitude}&travelmode=driving`;
    
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Map View */}
      {currentLocation && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onPress={handleMapPress}
        >
          {/* Current Location Marker */}
          <Marker
            coordinate={currentLocation}
            title="You are here"
            pinColor="blue"
          />

          {/* Destination Marker */}
          <Marker
            coordinate={{
              latitude: nextDestination.latitude,
              longitude: nextDestination.longitude,
            }}
            title={nextDestination.name}
            description={`${nextDestination.time} - ${nextDestination.activity}`}
            pinColor="red"
          />

          {/* Route Line */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#4A90E2"
              strokeWidth={4}
            />
          )}

          {/* All Location Markers */}
          {routineLocations.map((loc, index) => (
            index !== destinationIndex && (
              <Marker
                key={loc.id}
                coordinate={{
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                }}
                title={loc.name}
                description={`${loc.time} - ${loc.activity}`}
                pinColor="orange"
                onCalloutPress={() => {
                  // Long press to delete custom pins
                  if (parseInt(loc.id) > 4) {
                    handleDeletePin(loc.id);
                  }
                }}
              />
            )
          ))}
        </MapView>
      )}

      {/* Instruction Banner */}
      <View style={styles.instructionBanner}>
        <Text style={styles.instructionText}>📍 Tap anywhere on the map to add a custom location</Text>
      </View>

      {/* Navigation Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.nextLabel}>📍 Next Destination</Text>
        <Text style={styles.destinationName}>{nextDestination.name}</Text>
        <Text style={styles.destinationAddress}>{nextDestination.address}</Text>
        <Text style={styles.destinationTime}>⏰ {nextDestination.time} - {nextDestination.activity}</Text>
        
        {distance && duration && (
          <View style={styles.distanceInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>{distance} km</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Est. Time</Text>
              <Text style={styles.infoValue}>{duration} min</Text>
            </View>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.primaryButton} onPress={getDirections}>
            <Text style={styles.buttonText}>🧭 Start Navigation</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={openInMaps}>
            <Text style={styles.secondaryButtonText}>📱 Open in Maps</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleNextDestination}>
            <Text style={styles.secondaryButtonText}>⏭️ Next Stop</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* All Destinations List */}
      <View style={styles.destinationsList}>
        <Text style={styles.listTitle}>Today's Route ({routineLocations.length} stops)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {routineLocations.map((loc, index) => (
            <TouchableOpacity
              key={loc.id}
              style={[
                styles.destinationChip,
                index === destinationIndex && styles.activeChip
              ]}
              onPress={() => {
                setDestinationIndex(index);
                setNextDestination(loc);
              }}
              onLongPress={() => {
                if (parseInt(loc.id) > 4) {
                  handleDeletePin(loc.id);
                }
              }}
            >
              <Text style={styles.chipEmoji}>{loc.name.split(' ')[0]}</Text>
              <Text style={[
                styles.chipText,
                index === destinationIndex && styles.activeChipText
              ]}>
                {loc.name.substring(2)}
              </Text>
              <Text style={styles.chipTime}>{loc.time}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Add Pin Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📍 Add New Location</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 🍕 Pizza Place, 📚 Library"
                value={newPinName}
                onChangeText={setNewPinName}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 2:00 PM"
                value={newPinTime}
                onChangeText={setNewPinTime}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Activity</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Lunch, Study, Shopping"
                value={newPinActivity}
                onChangeText={setNewPinActivity}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.coordinateInfo}>
              <Text style={styles.coordinateText}>
                📍 Lat: {newPinLocation?.latitude.toFixed(4)} | Lng: {newPinLocation?.longitude.toFixed(4)}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSavePin}
              >
                <Text style={styles.saveButtonText}>💾 Save Pin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    flex: 1,
  },
  instructionBanner: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  infoCard: {
    position: 'absolute',
    top: 90,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  nextLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginBottom: 4,
  },
  destinationName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  destinationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  destinationTime: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 12,
  },
  distanceInfo: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  destinationsList: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  destinationChip: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  activeChip: {
    backgroundColor: '#4A90E2',
  },
  chipEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activeChipText: {
    color: '#fff',
  },
  chipTime: {
    fontSize: 10,
    color: '#888',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  coordinateInfo: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  coordinateText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 15,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});