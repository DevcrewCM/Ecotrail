import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/userSlice';
import { deleteSecureToken } from '../utils/security';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { seedDatabase } from '../utils/seedDatabase';

const DIFICULTAD_COLOR = {
  Fácil: '#4ade80',
  Medio: '#facc15',
  Difícil: '#f87171',
};

export default function RutasScreen({ navigation }) {
  const dispatch = useDispatch();
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRutas = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'rutas'));
      const rutasArray = [];
      querySnapshot.forEach((doc) => {
        rutasArray.push({ id: doc.id, ...doc.data() });
      });
      setRutas(rutasArray);
    } catch (error) {
      console.error("Error al cargar rutas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRutas();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={async () => {
            await deleteSecureToken();
            dispatch(logout());
            navigation.replace('Login');
          }}
        >
          <Text style={{ color: '#f87171', fontWeight: 'bold', fontSize: 16 }}>Salir</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rutas Disponibles</Text>
      <Text style={styles.subtitle}>Elige tu próxima aventura</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4ade80" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={rutas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RutaMenu', { ruta: item })}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{item.nombre}</Text>
              <Text style={styles.cardDistance}>{item.distancia}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: DIFICULTAD_COLOR[item.dificultad] + '33' }]}>
              <Text style={[styles.badgeText, { color: DIFICULTAD_COLOR[item.dificultad] }]}>
                {item.dificultad}
              </Text>
            </View>
          </TouchableOpacity>
        )}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f1f5f9',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    color: '#f1f5f9',
    fontWeight: '600',
    fontSize: 15,
  },
  cardDistance: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontWeight: '600',
    fontSize: 12,
  },
});
