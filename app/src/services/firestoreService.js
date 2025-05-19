import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc, 
    query,
    where,
    orderBy
  } from 'firebase/firestore';
  import { db } from '../firebase';
  
  // === PROJECTS ===
  const projectsCol = collection(db, 'projects');
  export const createProject = data =>
    addDoc(projectsCol, { ...data, createdAt: Date.now() });
  
  export const fetchProjects = () =>
    getDocs(query(projectsCol, orderBy('createdAt', 'desc')));
  
  export const updateProject = (id, data) =>
    updateDoc(doc(db, 'projects', id), data);
  
  export const deleteProject = id =>
    deleteDoc(doc(db, 'projects', id));
  
  // === TASKS ===
  const tasksCol = collection(db, 'tasks');
  export const createTask = data =>
    addDoc(tasksCol, { ...data, createdAt: Date.now() });
  
  export const fetchTasks = (projectId = null) => {
    const q = projectId
      ? query(tasksCol, where('projectId', '==', projectId), orderBy('dueDate'))
      : query(tasksCol, orderBy('dueDate'));
    return getDocs(q);
  };
  
  export const updateTask = (id, data) =>
    updateDoc(doc(db, 'tasks', id), data);
  
  export const deleteTask = id =>
    deleteDoc(doc(db, 'tasks', id));
  
  // === LABELS ===
  const labelsCol = collection(db, 'labels');
  export const createLabel = data =>
    addDoc(labelsCol, data);
  
  export const fetchLabels = () =>
    getDocs(query(labelsCol, orderBy('name')));
  
  export const updateLabel = (id, data) =>
    updateDoc(doc(db, 'labels', id), data);
  
  export const deleteLabel = id =>
    deleteDoc(doc(db, 'labels', id));
  
  // === COMMENTS ===
  const commentsCol = collection(db, 'comments');
  export const createComment = data =>
    addDoc(commentsCol, { ...data, createdAt: Date.now() });
  
  export const fetchCommentsByTask = taskId =>
    getDocs(query(commentsCol, where('taskId', '==', taskId), orderBy('createdAt')));
  
  export const updateComment = (id, data) =>
    updateDoc(doc(db, 'comments', id), data);
  
  export const deleteComment = id =>
    deleteDoc(doc(db, 'comments', id));