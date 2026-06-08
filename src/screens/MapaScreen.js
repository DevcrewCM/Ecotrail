import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';

export default function MapaScreen({ navigation, route }) {
  const ruta = route.params?.ruta ?? { 
    nombre: 'Ruta', 
    checkpoints: [] 
  };
  const currentSteps = useSelector((state) => state.user.steps);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No podemos mostrar tu ubicación en el mapa sin permisos.');
        return;
      }
      setHasLocationPermission(true);
    })();
  }, []);

  // Extraer solo las coordenadas para dibujar la línea
  const polylineCoordinates = (ruta.checkpoints || []).map(cp => ({
    latitude: cp.latitude,
    longitude: cp.longitude
  }));

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={hasLocationPermission}
        followsUserLocation={hasLocationPermission}
        initialRegion={{
          latitude: 42.8125,
          longitude: -1.6458,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
      >
        {polylineCoordinates.length > 1 && (
          <Polyline
            coordinates={polylineCoordinates}
            strokeColor="#22c55e"
            strokeWidth={4}
            lineDashPattern={[1]}
          />
        )}
        
        {(ruta.checkpoints || []).map((cp, index) => (
          <Marker
            key={cp.id || index.toString()}
            coordinate={{ latitude: cp.latitude, longitude: cp.longitude }}
            title={cp.title}
            description={cp.description}
          />
        ))}
      </MapView>

      {/* HUD: Podómetro flotante */}
      <View style={styles.hudContainer}>
        <Text style={styles.hudLabel}>Pasos Actuales</Text>
        <Text style={styles.hudValue}>{currentSteps.toLocaleString()}</Text>
      </View>

      <TouchableOpacity style={styles.cameraBtn} onPress={() => navigation.navigate('Camara', { ruta })}>
        <Text style={styles.cameraBtnText}>Cámara</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  hudContainer: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  hudLabel: {
    color: '#94a3b8',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  hudValue: {
    color: '#4ade80',
    fontSize: 22,
    fontWeight: '800',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
    backgroundColor: '#22c55e',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  cameraBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
