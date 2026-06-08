import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { useDispatch, useSelector } from 'react-redux';
import { addSteps } from '../store/slices/userSlice';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function usePedometer() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const dispatch = useDispatch();
  const currentSteps = useSelector((state) => state.user.steps);
  const user = useSelector((state) => state.user.user);

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

  // Sincronizar con Firestore para no perder los pasos
  useEffect(() => {
    if (user?.uid && currentSteps > 0 && currentSteps % 10 === 0) {
      setDoc(doc(db, 'usuarios', user.uid), { steps: currentSteps }, { merge: true })
        .catch(err => console.error('Error guardando pasos', err));
    }
  }, [currentSteps, user]);

  return isPedometerAvailable;
}
