import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapaScreen({ navigation, route }) {
  const ruta = route.params?.ruta ?? { 
    nombre: 'Ruta', 
    checkpoints: [] 
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 42.8125,
          longitude: -1.6458,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
      >
        {(ruta.checkpoints || []).map((cp, index) => (
          <Marker
            key={cp.id || index.toString()}
            coordinate={{ latitude: cp.latitude, longitude: cp.longitude }}
            title={cp.title}
            description={cp.description}
          />
        ))}
      </MapView>

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
