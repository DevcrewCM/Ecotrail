import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import RutasScreen from '../screens/RutasScreen';
import RutaMenuScreen from '../screens/RutaMenuScreen';
import MapaScreen from '../screens/MapaScreen';
import GaleriaScreen from '../screens/GaleriaScreen';
import LogrosScreen from '../screens/LogrosScreen';
import CamaraScreen from '../screens/CamaraScreen';

import usePedometer from '../hooks/usePedometer';

const Stack = createStackNavigator();

export default function AppNavigator() {
  usePedometer();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#1e293b' },
          headerTintColor: '#f1f5f9',
          headerTitleStyle: { fontWeight: 'bold' },
          cardStyle: { backgroundColor: '#0f172a' },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Rutas"
          component={RutasScreen}
          options={{ title: 'EcoTrail', headerLeft: null }}
        />
        <Stack.Screen
          name="RutaMenu"
          component={RutaMenuScreen}
          options={({ route }) => ({
            title: route.params?.ruta?.nombre ?? 'Menú de Ruta',
          })}
        />
        <Stack.Screen
          name="Mapa"
          component={MapaScreen}
          options={{ title: 'Mapa de Ruta' }}
        />
        <Stack.Screen
          name="Galeria"
          component={GaleriaScreen}
          options={{ title: 'Galería' }}
        />
        <Stack.Screen
          name="Logros"
          component={LogrosScreen}
          options={{ title: 'Logros' }}
        />
        <Stack.Screen
          name="Camara"
          component={CamaraScreen}
          options={{ title: 'Camara'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
