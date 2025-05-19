import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

export default function LoginPage() {
  const { login, resetPassword } = useContext(AuthContext);
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Неверный email или пароль');
    }
  };

  const handleReset = async () => {
    try {
      await resetPassword(email);
      alert('Письмо для сброса пароля отправлено');
    } catch {
      alert('Ошибка при отправке письма');
    }
  };

  return (
    <Container className="auth-container">
      <h2 className="form-title">Вход</h2>
      {error && <Alert variant="danger" className="alert-custom">{error}</Alert>}
      <Form onSubmit={handleLogin} className="auth-form">
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">Войти</Button>
        <Link to="/forgot-password" className="link-reset">Забыли пароль?</Link>
         <br></br>
        <Link to="/register" className="link-reset">
          Нет аккаунта? Регистрация
        </Link>
      </Form>
    </Container>
  );
}
