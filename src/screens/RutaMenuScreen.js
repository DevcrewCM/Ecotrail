import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function RutaMenuScreen({ navigation, route }) {
  const ruta = route.params?.ruta ?? { nombre: 'Ruta' };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ruta.nombre}</Text>
      <Text style={styles.subtitle}>¿Qué quieres hacer?</Text>

      <TouchableOpacity
        style={[styles.btn, styles.btnPrimary]}
        onPress={() => navigation.navigate('Mapa', { ruta })}
      >
        <Text style={styles.btnText}>Empezar Ruta</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.btnSecondary]}
        onPress={() => navigation.navigate('Galeria', { ruta })}
      >
        <Text style={styles.btnText}>Galería</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.btnTertiary]}
        onPress={() => navigation.navigate('Logros', { ruta })}
      >
        <Text style={styles.btnText}>Logros</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 36,
  },
  btn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    gap: 14,
  },
  btnPrimary: {
    backgroundColor: '#22c55e',
  },
  btnSecondary: {
    backgroundColor: '#3b82f6',
  },
  btnTertiary: {
    backgroundColor: '#f59e0b',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
