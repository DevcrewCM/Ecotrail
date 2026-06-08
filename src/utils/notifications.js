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
 * Pide permisos de notificación y devuelve el Expo Push Token del dispositivo.
 * Este token es lo que se guarda en Firestore para poder enviar notificaciones
 * al usuario a través del servicio gratuito de Expo (Opción B).
 */
export async function registerForNotifications() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permisos de notificación denegados.');
      return null;
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

    // Obtener el Expo Push Token (identificador único de este dispositivo)
    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data; // Formato: "ExponentPushToken[xxxxxx]"

  } catch (e) {
    console.warn('No se pudo obtener el Expo Push Token:', e);
    return null;
  }
}

/**
 * Envía una notificación push real al dispositivo a través del servicio de Expo.
 * Esto funciona aunque la app esté cerrada o en segundo plano.
 * 
 * @param {string} pushToken - El Expo Push Token guardado en Firestore del usuario
 * @param {string} titulo - Título del logro
 * @param {string} descripcion - Descripción del logro
 */
export async function sendExpoPushNotification(pushToken, titulo, descripcion) {
  if (!pushToken) {
    console.warn('No hay push token disponible, usando notificación local de respaldo.');
    await sendLocalNotification(titulo, descripcion);
    return;
  }

  const message = {
    to: pushToken,
    sound: 'default',
    title: `Logro Alcanzado: ${titulo}`,
    body: descripcion,
    data: { type: 'logro' },
    ...(Platform.OS === 'android' && { channelId: 'logros' }),
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    const result = await response.json();
    if (result?.data?.status === 'error') {
      console.warn('Error en Expo Push API:', result.data.message);
      await sendLocalNotification(titulo, descripcion); // Respaldo local
    }
  } catch (e) {
    console.error('Error enviando notificación push:', e);
    await sendLocalNotification(titulo, descripcion); // Respaldo local
  }
}

/**
 * Notificación local de respaldo (en caso de que Expo Push API no esté disponible).
 */
async function sendLocalNotification(titulo, descripcion) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Logro Alcanzado: ${titulo}`,
      body: descripcion,
      data: { type: 'logro' },
    },
    trigger: null,
  });
}
