import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';
import type { CarData } from './types';
import { getFirebaseDb } from './firebase';

function getCarsCollection() {
  return collection(getFirebaseDb(), 'cars');
}

export async function getCars() {
  const carsCollection = getCarsCollection();
  const snapshot = await getDocs(carsCollection);
  return snapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() })) as CarData[];
}

export async function getRareCars() {
  const carsCollection = getCarsCollection();
  const q = query(carsCollection, where('category', '==', 'rare-collection'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() })) as CarData[];
}

export async function getGarageCars() {
  const carsCollection = getCarsCollection();
  const q = query(carsCollection, where('category', '==', 'garage'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() })) as CarData[];
}

export function subscribeToCars(callback: (cars: CarData[]) => void) {
  const carsCollection = getCarsCollection();
  return onSnapshot(carsCollection, (snapshot) => {
    const cars = snapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() })) as CarData[];
    callback(cars);
  });
}

export async function addCar(carData: Partial<CarData>) {
  // We can initially add the document, then maybe use its ID for the 'id' field if needed.
  // We'll trust the caller handles the 'id' correctly or we can default it.
  if (!carData.id) {
    carData.id = crypto.randomUUID();
  }
  const carsCollection = getCarsCollection();
  const docRef = await addDoc(carsCollection, carData);
  return docRef.id;
}

export async function updateCar(id: string, carData: Partial<CarData>) {
  // Strip _id to avoid writing it to Firestore
  const { _id, ...safeData } = carData as any;
  const carRef = doc(getFirebaseDb(), 'cars', id);
  await updateDoc(carRef, safeData);
}

export async function deleteCar(id: string) {
  const carRef = doc(getFirebaseDb(), 'cars', id);
  await deleteDoc(carRef);
}
