import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useSelector } from 'react-redux';

export default function GaleriaScreen({ route }) {
  const ruta = route.params?.ruta ?? { id: '1', nombre: 'Ruta' };
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Si hay fotos locales en Redux (por la cámara), también las leemos
  const imagesRedux = useSelector((state) => state.images || {});
  const displayImagesRedux = Object.values(imagesRedux).filter((image) => image.route_id == ruta.id);

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const q = query(collection(db, 'galeria'), where('rutaId', '==', String(ruta.id)));
        const querySnapshot = await getDocs(q);
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

  // Combinamos las fotos de Firestore con las fotos locales recién tomadas
  const todasLasFotos = [...fotos, ...displayImagesRedux];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Galería</Text>
      <Text style={styles.subtitle}>{ruta.nombre}</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#4ade80" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={todasLasFotos}
          keyExtractor={(item, index) => String(item.id || index)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.uri ? (
                <Image style={styles.image} source={{ uri: item.uri }} />
              ) : item.urlFoto ? (
                <Image style={styles.image} source={{ uri: item.urlFoto }} />
              ) : null}
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
