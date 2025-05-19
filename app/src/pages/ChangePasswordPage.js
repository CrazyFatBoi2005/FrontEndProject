import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

export default function ChangePasswordPage() {
  const { changePassword } = useContext(AuthContext);
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [error, setError]             = useState('');
  const [message, setMessage]         = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }
    try {
      await changePassword(password);
      setMessage('Пароль успешно изменён. Перелогинивайтесь.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="auth-container">
      <h2 className="form-title">Изменить пароль</h2>
      {error   && <Alert variant="danger" className="alert-custom">{error}</Alert>}
      {message && <Alert variant="success" className="alert-custom">{message}</Alert>}
      <Form onSubmit={handleSubmit} className="auth-form">
        <Form.Group className="mb-3">
          <Form.Label>Новый пароль</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Подтвердите пароль</Form.Label>
          <Form.Control
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            minLength={6}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Сменить пароль</Button>
        <Link to="/" className="link-reset">Назад на главную</Link>
      </Form>
    </Container>
  );
}
