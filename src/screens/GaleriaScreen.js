import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

import { useSelector } from 'react-redux'
import { retrieveImages } from '../store/slices/imageSlice';


const FOTOS_MOCK = [
  { id: '1', lugar: 'Mirador Norte', fecha: '12 May 2026' },
  { id: '2', lugar: 'Puente de Piedra', fecha: '10 May 2026' },
  { id: '3', lugar: 'Cascada del Bosque', fecha: '5 May 2026' },
];

export default function GaleriaScreen({ navigation, route }) {
  const ruta = route.params?.ruta ?? { nombre: 'Ruta' };
  const images = useSelector((state) => state.images)

  const displayImages = Object.values(images).filter((image) => image.route_id == ruta.id)

  console.log("preeee: " + JSON.stringify(images))
  console.log("post: " + JSON.stringify(displayImages))

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Galería</Text>
      <Text style={styles.subtitle}>{ruta.nombre}</Text>
      <FlatList
        data={displayImages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Image
                style={styles.image}
                source={item.uri}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f1f5f9',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardLugar: {
    color: '#f1f5f9',
    fontWeight: '600',
    fontSize: 15,
  },
  cardFecha: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  image: {
    width: 50,
    height: 50,
  },
});
