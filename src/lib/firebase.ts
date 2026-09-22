import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  onSnapshot,
  writeBatch,
  query,
  orderBy,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use the specific firestoreDatabaseId provisioned for this applet
export const db: Firestore = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

export {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  onSnapshot,
  writeBatch,
  query,
  orderBy,
};
