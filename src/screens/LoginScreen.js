import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { saveSecureToken, getSecureToken } from '../utils/security';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../store/slices/userSlice';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const generateToken = (email) => `token_${email}_${Date.now()}`;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      // Iniciar sesión con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Guardar un token simulado para la biometría (basado en el UID del usuario)
      const token = `token_firebase_${userCredential.user.uid}`;
      await saveSecureToken(token);
      
      dispatch(setUser({ email: userCredential.user.email, uid: userCredential.user.uid }));
      dispatch(setToken(token));
      navigation.replace('Rutas');
    } catch (error) {
      console.error(error);
      let mensajeError = 'No se pudo iniciar sesión.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          mensajeError = 'Credenciales incorrectas.';
      } else if (error.code === 'auth/invalid-email') {
          mensajeError = 'Formato de email inválido.';
      }
      Alert.alert('Error', mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert('Error', 'Este dispositivo no soporta autenticación biométrica.');
        return;
      }
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert('Error', 'No hay biometría configurada en este dispositivo.');
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Accede a EcoTrail con tu huella o Face ID',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar contraseña',
      });
      if (result.success) {
        const token = await getSecureToken();
        if (!token) {
          Alert.alert('Aviso', 'No hay sesión previa. Inicia sesión primero con email y contraseña.');
          return;
        }
        dispatch(setToken(token));
        navigation.replace('Rutas');
      }
    } catch (error) {
      Alert.alert('Error', 'La autenticación biométrica falló.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.logo}>🌿 EcoTrail</Text>
        <Text style={styles.subtitle}>Tu aventura sostenible comienza aquí</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnPrimaryText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.btnSecondary} onPress={handleBiometricLogin}>
          <Text style={styles.btnSecondaryText}>🔒 Acceso Biométrico</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4ade80',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 28,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 14,
    color: '#f1f5f9',
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnPrimary: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    color: '#64748b',
    marginHorizontal: 10,
    fontSize: 13,
  },
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: '#22c55e',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: '#22c55e',
    fontWeight: '600',
    fontSize: 15,
  },
});
