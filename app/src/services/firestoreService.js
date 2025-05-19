import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

export async function createTask(data, userId) {
  return await addDoc(collection(db, 'tasks'), {
    ...data,
    ownerId: userId,
    createdAt: Date.now()
  });
}

export async function updateTask(taskId, data) {
  await updateDoc(doc(db, 'tasks', taskId), data);
}

export async function deleteTask(taskId) {
  await deleteDoc(doc(db, 'tasks', taskId));
}

export async function fetchUserTasks(userId) {
  const q = query(
    collection(db, 'tasks'),
    where('ownerId', '==', userId),
    orderBy('dueDate')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
