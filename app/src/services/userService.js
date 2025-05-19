import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase';

export async function fetchUserProfile(uid) {
  const snap = await getDocs(collection(db, 'users'));
  const userDoc = snap.docs.find(d => d.id === uid);
  return userDoc ? { userId: userDoc.id, ...userDoc.data() } : null;
}

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), data);
}

export async function createUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), data);
}

export async function fetchAllUsers() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => ({ userId: d.id, ...d.data() }));
}

export async function updateUserRole(uid, role) {
  await updateDoc(doc(db, 'users', uid), { role });
}

export async function deleteUser(uid) {
  await deleteDoc(doc(db, 'users', uid));
}