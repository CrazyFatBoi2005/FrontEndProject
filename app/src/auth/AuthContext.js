import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword as fbUpdatePassword
} from 'firebase/auth';
import { createUserProfile } from '../services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, current => {
      setUser(current);
      setLoading(false);
    });
    return unsub;
  }, []);

  const register = async (email, password, displayName) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    await createUserProfile(user.uid, {
      name: displayName,
      email: user.email,
      role: 'user'
    });
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const resetPassword = email =>
    sendPasswordResetEmail(auth, email);

  const changePassword = async newPassword => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Пользователь не авторизован');

  try {
    await fbUpdatePassword(currentUser, newPassword);
  } catch (err) {
    if (err.code === 'auth/requires-recent-login') {
      throw new Error('Для смены пароля требуется недавняя аутентификация. Пожалуйста, войдите снова.');
    }
    throw err;
  }
};

  return (
     <AuthContext.Provider value={{ user, loading, register, login, logout, resetPassword, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};