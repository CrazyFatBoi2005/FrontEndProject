import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import {
  fetchAllUsers,
  updateUserRole,
  deleteUser
} from '../services/userService';

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAllUsers().then(setUsers).catch(console.error);
  }, []);

  const handleToggleRole = async u => {
    const next = u.role === 'user' ? 'admin' : 'user';
    await updateUserRole(u.userId, next);
    setUsers(users.map(x => x.userId === u.userId ? { ...x, role: next } : x));
  };

  const handleDelete = async u => {
    await deleteUser(u.userId);
    setUsers(users.filter(x => x.userId !== u.userId));
  };

  return (
    <div className="admin-container">
      <h2>Пользователи</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.userId}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <Button
                  size="sm"
                  onClick={() => handleToggleRole(u)}
                  className="me-2"
                >
                  {u.role === 'user' ? 'Сделать админом' : 'Сделать юзером'}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(u)}
                >
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}