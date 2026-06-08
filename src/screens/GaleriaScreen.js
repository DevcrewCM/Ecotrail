import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function GaleriaScreen({ route }) {
  const ruta = route.params?.ruta ?? { id: '1', nombre: 'Ruta' };
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'rutas', String(ruta.id), 'galeria'));
        const fotosArray = [];
        querySnapshot.forEach((doc) => {
          fotosArray.push({ id: doc.id, ...doc.data() });
        });
        setFotos(fotosArray);
      } catch (error) {
        console.error("Error cargando fotos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFotos();
  }, [ruta.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Galería</Text>
      <Text style={styles.subtitle}>{ruta.nombre}</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#4ade80" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={fotos}
          keyExtractor={(item) => 'fs-' + item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.urlFoto && !item.urlFoto.startsWith('ph://') ? (
                <Image style={styles.image} source={{ uri: item.urlFoto }} />
              ) : (
                <View style={[styles.image, { backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center' }}>Foto rota</Text>
                </View>
              )}
              <View>
                <Text style={styles.cardLugar}>{item.lugar || 'Foto Capturada'}</Text>
                <Text style={styles.cardFecha}>{item.fecha || new Date().toLocaleDateString()}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: '#94a3b8', textAlign: 'center', marginTop: 20 }}>
              Aún no hay fotos en esta ruta.
            </Text>
          }
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
    borderRadius: 8,
  },
});
