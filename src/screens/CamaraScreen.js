import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import { useRef, useState, useEffect } from "react";
import { Button, Pressable, StyleSheet, Text, View, Alert } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function CamaraScreen({ navigation, route }) {
  const ruta = route.params?.ruta ?? { nombre: 'Ruta' };

  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  
  const ref = useRef(null);
  const [facing, setFacing] = useState("back");

  useEffect(() => {
    if (mediaPermission?.status !== 'granted') {
      requestMediaPermission();
    }
  }, [mediaPermission]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Se necesitan permisos para usar la camara.
        </Text>
        <Button onPress={requestPermission} title="Dar Permisos" />
      </View>
    );
  }

  const takePicture = async () => {
    try {
      const photo = await ref.current?.takePictureAsync();
      
      if (!photo || !photo.uri) {
        throw new Error('La foto no se capturó correctamente.');
      }

      let finalUri = photo.uri;

      // Intentar guardar en la galería física del dispositivo
      try {
        if (mediaPermission?.granted) {
          // Guardamos copia física en el carrete del usuario
          await MediaLibrary.createAssetAsync(photo.uri);
          // IMPORTANTE: NO usamos asset.uri (ph:// en iOS) porque <Image> crashea al intentar leerlo.
          // Seguimos usando finalUri = photo.uri (file://) para guardarlo en la base de datos local.
        }
      } catch (mediaError) {
        console.warn('No se pudo guardar en la galería física, usando URI temporal:', mediaError);
      }
      
      // Guardar metadata en Firestore (Subcolección de la ruta activa)
      await addDoc(collection(db, 'rutas', String(ruta.id), 'galeria'), {
        urlFoto: finalUri,
        lugar: 'Foto en Ruta',
        fecha: new Date().toLocaleDateString()
      });

      Alert.alert('¡Foto Guardada!', 'La foto se ha guardado correctamente en la ruta.');
    } catch (error) {
      console.error('Error al guardar la foto:', error);
      Alert.alert('Error', `No se pudo guardar la foto: ${error.message || error}`);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          ref={ref}
          facing={facing}
          mute={false}
        />
        <View style={styles.shutterContainer}>
          <Pressable onPress={takePicture}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  { opacity: pressed ? 0.5 : 1 },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    { backgroundColor: "white" },
                  ]}
                />
              </View>
            )}
          </Pressable>
          <Pressable onPress={toggleFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: StyleSheet.absoluteFillObject,
  camera: StyleSheet.absoluteFillObject,
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});