import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function LogrosScreen({ route }) {
  const ruta = route.params?.ruta ?? { nombre: 'Ruta' };
  const currentSteps = useSelector((state) => state.user.steps);
  const [logros, setLogros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogros = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'logros'));
        const logrosArray = [];
        querySnapshot.forEach((doc) => {
          logrosArray.push({ id: doc.id, ...doc.data() });
        });
        // Ordenar por pasos requeridos para que salgan en orden
        logrosArray.sort((a, b) => a.pasos - b.pasos);
        setLogros(logrosArray);
      } catch (error) {
        console.error("Error cargando logros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogros();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logros</Text>
      <Text style={styles.subtitle}>{ruta.nombre} - Llevas {currentSteps} pasos</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#4ade80" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={logros}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isDesbloqueado = currentSteps >= item.pasos;
            
            return (
              <View style={[styles.card, !isDesbloqueado && styles.cardLocked]}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.titulo}</Text>
                  <Text style={styles.cardDesc}>{item.descripcion}</Text>
                  <Text style={styles.cardPasos}>{item.pasos.toLocaleString()} pasos requeridos</Text>
                </View>
              </View>
            );
          }}
        />
      )}
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
});
