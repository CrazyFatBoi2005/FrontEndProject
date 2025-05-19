import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const { resetPassword } = useContext(AuthContext);
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Введите email для сброса пароля');
      return;
    }

    try {
      await resetPassword(email);
      setMessage('Письмо для сброса пароля отправлено. Проверьте почту.');
    } catch (err) {
      setError('Не удалось отправить письмо. Проверьте email.');
    }
  };

  return (
    <Container className="auth-container">
      <h2 className="form-title">Сброс пароля</h2>
      {error   && <Alert variant="danger" className="alert-custom">{error}</Alert>}
      {message && <Alert variant="success" className="alert-custom">{message}</Alert>}
      <Form onSubmit={handleSubmit} className="auth-form">
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@mail.com"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">Отправить письмо</Button>
        <Link to="/login" className="link-reset">Назад ко входу</Link>
      </Form>
    </Container>
  );
}
