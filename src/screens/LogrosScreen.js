import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const LOGROS = [
  { id: '1', titulo: 'Primer Paso', descripcion: 'Completa tu primera ruta', pasos: 1000, icono: '👣', desbloqueado: true },
  { id: '2', titulo: 'Explorador', descripcion: 'Completa 5 rutas distintas', pasos: 5000, icono: '🧭', desbloqueado: false },
  { id: '3', titulo: 'Maratonista Verde', descripcion: 'Acumula 20 km en total', pasos: 10000, icono: '🏅', desbloqueado: false },
  { id: '4', titulo: 'Fotógrafo Natural', descripcion: 'Captura 10 fotos en ruta', pasos: 0, icono: '📸', desbloqueado: false },
];

export default function LogrosScreen({ route }) {
  const ruta = route.params?.ruta ?? { nombre: 'Ruta' };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Logros</Text>
      <Text style={styles.subtitle}>{ruta.nombre}</Text>
      <FlatList
        data={LOGROS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, !item.desbloqueado && styles.cardLocked]}>
            <Text style={styles.cardIcon}>{item.icono}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardDesc}>{item.descripcion}</Text>
              {item.pasos > 0 && (
                <Text style={styles.cardPasos}>{item.pasos.toLocaleString()} pasos</Text>
              )}
            </View>
            <Text style={styles.lock}>{item.desbloqueado ? '✅' : '🔒'}</Text>
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
    gap: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardLocked: {
    opacity: 0.5,
  },
  cardIcon: {
    fontSize: 34,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: '#f1f5f9',
    fontWeight: '700',
    fontSize: 15,
  },
  cardDesc: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  cardPasos: {
    color: '#4ade80',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  lock: {
    fontSize: 20,
  },
});
