# EcoTrail

EcoTrail es una aplicación móvil diseñada para el seguimiento y la interacción en rutas de senderismo. 

El objetivo principal de este proyecto es ofrecer una herramienta que sirva como guía de rutas y, al mismo tiempo, permita monitorizar el esfuerzo físico, registrar los recorridos y llevar un control de los lugares visitados a través de fotografías.

## Funcionalidades Principales

- **Trazado de rutas en tiempo real:** Geolocalización mediante GPS que posiciona al usuario en el mapa y dibuja el recorrido exacto sobre la ruta seleccionada.
- **Podómetro persistente:** Sistema de conteo de pasos que funciona y se sincroniza constantemente con la base de datos en la nube. El progreso del usuario se mantiene seguro aunque cierre la aplicación o cambie de dispositivo.
- **Cámara y galería integradas:** Permite hacer fotografías desde la propia ruta. Las imágenes se guardan físicamente en el dispositivo y se vinculan a la base de datos de la ruta activa, creando una galería local automatizada.
- **Autenticación biométrica:** Inicio de sesión rápido utilizando la huella dactilar o el reconocimiento facial del dispositivo, sin necesidad de introducir contraseñas constantemente.
- **Sistema de logros:** Reconocimientos internos basados en el progreso y la distancia recorrida por el usuario.

## Stack Tecnológico

El desarrollo de la aplicación se apoya en el siguiente entorno:

- **Frontend:** React Native construido sobre Expo. Se hace uso intensivo de módulos nativos como `expo-location` para el mapeo, `expo-camera` para la captura de imágenes, `expo-sensors` para el conteo de pasos y `expo-local-authentication` para el acceso biométrico.
- **Gestión de estado:** Toda la información local de la app y las sesiones se manejan mediante Redux Toolkit.
- **Backend:** Infraestructura basada en Firebase. Utiliza Firebase Authentication para el registro seguro de cuentas y Firestore como base de datos en tiempo real para almacenar rutas, progreso y galerías.

## Instalación y Pruebas

Para levantar el proyecto en un entorno local, sigue estos pasos:

1. Clona el repositorio en tu equipo.
2. Ejecuta `npm install` para instalar todas las dependencias.
3. Arranca el servidor de desarrollo con `npx expo start`.

*Nota sobre pruebas: Como la aplicación requiere permisos nativos de cámara, sensores de hardware y localización en segundo plano, se recomienda compilar un Development Build en un dispositivo físico para evitar las restricciones de permisos que tiene la aplicación estándar de Expo Go.*
