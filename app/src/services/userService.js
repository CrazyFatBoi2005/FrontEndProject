import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function createUserProfile(uid, { name, email, role = 'user' }) {
  return setDoc(doc(db, 'users', uid), {
    userId: uid,
    name,
    email,
    role,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
}
export async function fetchUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}
export async function updateUserProfile(uid, updates) {
  await updateDoc(doc(db, 'users', uid), {
    ...updates,
    updatedAt: Date.now()
  });
}