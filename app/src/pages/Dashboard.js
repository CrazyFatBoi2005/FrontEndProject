import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Добро пожаловать, {user.name}!</h1>
      <button onClick={logout}>Выйти</button>
      <p>Здесь будет ваша доска задач.</p>
    </div>
  );
};

export default Dashboard;
