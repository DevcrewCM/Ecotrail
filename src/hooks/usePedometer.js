import { useState, useEffect, useRef } from 'react';
import { Pedometer } from 'expo-sensors';
import { useDispatch, useSelector } from 'react-redux';
import { addSteps, addNotifiedLogro } from '../store/slices/userSlice';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { sendExpoPushNotification } from '../utils/notifications';

export default function usePedometer() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const dispatch = useDispatch();
  const currentSteps = useSelector((state) => state.user.steps);
  const user = useSelector((state) => state.user.user);
  const notifiedLogros = useSelector((state) => state.user.notifiedLogros);
  const expoPushToken = useSelector((state) => state.user.expoPushToken);

  // Usamos refs para acceder al valor más reciente dentro de los callbacks
  const stepsRef = useRef(currentSteps);
  const notifiedRef = useRef(notifiedLogros);
  const logrosRef = useRef([]);

  useEffect(() => { stepsRef.current = currentSteps; }, [currentSteps]);
  useEffect(() => { notifiedRef.current = notifiedLogros; }, [notifiedLogros]);

  // Cargar la lista de logros de Firestore una sola vez al montar
  useEffect(() => {
    const fetchLogros = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'logros'));
        const arr = [];
        querySnapshot.forEach((docSnap) => {
          arr.push({ id: docSnap.id, ...docSnap.data() });
        });
        logrosRef.current = arr;
      } catch (e) {
        console.warn('No se pudieron cargar los logros:', e);
      }
    };
    fetchLogros();
  }, []);

  // Suscripción al podómetro
  useEffect(() => {
    let subscription;

    const subscribe = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(String(isAvailable));

        if (isAvailable) {
          const { status } = await Pedometer.requestPermissionsAsync();
          if (status === 'granted') {
            let previousSteps = 0;
            subscription = Pedometer.watchStepCount((result) => {
              const delta = result.steps - previousSteps;
              if (delta > 0) {
                dispatch(addSteps(delta));
              }
              previousSteps = result.steps;
            });
          }
        }
      } catch (error) {
        setIsPedometerAvailable('error');
      }
    };

    subscribe();

    return () => {
      if (subscription && subscription.remove) {
        subscription.remove();
      }
    };
  }, [dispatch]);

  // Sincronizar pasos con Firestore cada 10 pasos
  useEffect(() => {
    if (user?.uid && currentSteps > 0 && currentSteps % 10 === 0) {
      setDoc(doc(db, 'usuarios', user.uid), { steps: currentSteps }, { merge: true })
        .catch(err => console.error('Error guardando pasos', err));
    }
  }, [currentSteps, user]);

  // Comprobar logros desbloqueados cada vez que cambian los pasos
  useEffect(() => {
    if (!user?.uid || logrosRef.current.length === 0) return;

    logrosRef.current.forEach((logro) => {
      const yaNotificado = notifiedRef.current.includes(logro.id);
      const logroAlcanzado = currentSteps >= logro.pasos;

      if (logroAlcanzado && !yaNotificado) {
        // 1. Enviar notificación push via Expo Push Service (llega aunque la app esté cerrada)
        sendExpoPushNotification(expoPushToken, logro.titulo, logro.descripcion);

        // 2. Registrar en Redux para no repetir el aviso
        dispatch(addNotifiedLogro(logro.id));

        // 3. Guardar en Firestore para que persista entre sesiones
        setDoc(
          doc(db, 'usuarios', user.uid),
          { notifiedLogros: [...notifiedRef.current, logro.id] },
          { merge: true }
        ).catch(err => console.error('Error guardando logro notificado:', err));
      }
    });
  }, [currentSteps, user]);

  return isPedometerAvailable;
}
