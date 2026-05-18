import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const CHECKPOINTS = [
  {
    id: 1,
    title: 'Inicio',
    description: 'Punto de partida de la ruta',
    latitude: 40.4168,
    longitude: -3.7038,
  },
  {
    id: 2,
    title: 'Checkpoint 1',
    description: 'Mirador del bosque',
    latitude: 40.4220,
    longitude: -3.7100,
  },
  {
    id: 3,
    title: 'Meta',
    description: 'Punto final de la ruta',
    latitude: 40.4280,
    longitude: -3.7160,
  },
];

export default function MapaScreen({ navigation, route }) {
  const ruta = route.params?.ruta ?? { nombre: 'Ruta' };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 40.4168,
          longitude: -3.7038,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {CHECKPOINTS.map((cp) => (
          <Marker
            key={cp.id}
            coordinate={{ latitude: cp.latitude, longitude: cp.longitude }}
            title={cp.title}
            description={cp.description}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.cameraBtn} onPress={() => {}}>
        <Text style={styles.cameraBtnText}>📷 Cámara</Text>
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
