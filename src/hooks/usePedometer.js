import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { useDispatch } from 'react-redux';
import { addSteps } from '../store/slices/userSlice';

export default function usePedometer() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const dispatch = useDispatch();

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
  }, []);

  return isPedometerAvailable;
}
