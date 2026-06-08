import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar cómo se muestran las notificaciones mientras la app está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Pide permisos de notificación al usuario (solo la primera vez).
 * Devuelve true si los permisos han sido concedidos.
 */
export async function registerForNotifications() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Permisos de notificación denegados.');
    return false;
  }

  // En Android hay que crear un canal de notificación
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('logros', {
      name: 'Logros EcoTrail',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#22c55e',
    });
  }

  return true;
}

/**
 * Lanza una notificación local inmediata de logro alcanzado.
 */
export async function sendLogroNotification(titulo, descripcion) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Logro Alcanzado: ${titulo}`,
      body: descripcion,
      data: { type: 'logro' },
      ...(Platform.OS === 'android' && { channelId: 'logros' }),
    },
    trigger: null, // null = inmediata
  });
}
