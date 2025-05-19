import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { fetchUserProfile } from '../services/userService';

export default function PrivateRoute({ role }) {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  useEffect(() => {
    if (!user) {
      setLoadingProfile(false);
      return;
    }
    setLoadingProfile(true);
    fetchUserProfile(user.uid)
      .then(data => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false));
  }, [user]);
  if (loadingProfile) {
    return null;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && profile?.role !== role) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
