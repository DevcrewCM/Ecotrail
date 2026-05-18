import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const FOTOS_MOCK = [
  { id: '1', lugar: 'Mirador Norte', fecha: '12 May 2026', icono: '🌅' },
  { id: '2', lugar: 'Puente de Piedra', fecha: '10 May 2026', icono: '🌉' },
  { id: '3', lugar: 'Cascada del Bosque', fecha: '5 May 2026', icono: '💦' },
];

export default function GaleriaScreen({ route }) {
  const ruta = route.params?.ruta ?? { nombre: 'Ruta' };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📷 Galería</Text>
      <Text style={styles.subtitle}>{ruta.nombre}</Text>
      <FlatList
        data={FOTOS_MOCK}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardIcon}>{item.icono}</Text>
            <View>
              <Text style={styles.cardLugar}>{item.lugar}</Text>
              <Text style={styles.cardFecha}>{item.fecha}</Text>
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
  cardIcon: {
    fontSize: 36,
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
});
