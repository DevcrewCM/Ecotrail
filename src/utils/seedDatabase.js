import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const CHECKPOINTS_PAMPLONA = [
  { id: 1, title: 'Inicio', description: 'Plaza del Castillo', latitude: 42.8125, longitude: -1.6458 },
  { id: 2, title: 'Checkpoint 1', description: 'Parque de la Taconera', latitude: 42.8160, longitude: -1.6495 },
  { id: 3, title: 'Meta', description: 'Paseo del Arga', latitude: 42.8220, longitude: -1.6420 },
];

const RUTAS = [
  { id: '1', nombre: 'Ruta del Bosque Verde', distancia: '5.2 km', dificultad: 'Fácil', checkpoints: CHECKPOINTS_PAMPLONA },
  { id: '2', nombre: 'Sendero del Río Claro', distancia: '8.7 km', dificultad: 'Medio', checkpoints: CHECKPOINTS_PAMPLONA },
  { id: '3', nombre: 'Cumbre del Águila', distancia: '14.3 km', dificultad: 'Difícil', checkpoints: CHECKPOINTS_PAMPLONA },
  { id: '4', nombre: 'Valle de las Flores', distancia: '3.1 km', dificultad: 'Fácil', checkpoints: CHECKPOINTS_PAMPLONA },
  { id: '5', nombre: 'Ladera Rocosa', distancia: '11.0 km', dificultad: 'Medio', checkpoints: CHECKPOINTS_PAMPLONA },
];

const LOGROS = [
  { id: '1', titulo: 'Primer Paso', descripcion: 'Completa tu primera ruta', pasos: 1000 },
  { id: '2', titulo: 'Explorador', descripcion: 'Completa 5 rutas distintas', pasos: 5000 },
  { id: '3', titulo: 'Maratonista Verde', descripcion: 'Acumula 20 km en total', pasos: 10000 },
  { id: '4', titulo: 'Fotógrafo Natural', descripcion: 'Captura 10 fotos en ruta', pasos: 100 },
];

const GALERIA = [
  { id: '1', rutaId: '1', lugar: 'Mirador Norte', fecha: '12 May 2026', urlFoto: '' },
  { id: '2', rutaId: '2', lugar: 'Puente de Piedra', fecha: '10 May 2026', urlFoto: '' },
  { id: '3', rutaId: '1', lugar: 'Cascada del Bosque', fecha: '5 May 2026', urlFoto: '' },
];

export const seedDatabase = async () => {
  try {
    console.log('Iniciando el sembrado de la base de datos...');
    
    // Subir rutas
    for (const ruta of RUTAS) {
      await setDoc(doc(db, 'rutas', ruta.id), ruta);
    }
    console.log('Rutas subidas correctamente.');

    // Subir logros
    for (const logro of LOGROS) {
      await setDoc(doc(db, 'logros', logro.id), logro);
    }
    console.log('Logros subidos correctamente.');

    // Subir galeria
    for (const foto of GALERIA) {
      await setDoc(doc(db, 'galeria', foto.id), foto);
    }
    console.log('Galería subida correctamente.');

    console.log('Sembrado completado con éxito.');
  } catch (error) {
    console.error('Error durante el sembrado de la base de datos:', error);
  }
};
