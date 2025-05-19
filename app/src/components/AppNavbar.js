import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Container, Nav, Button, Image, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { ThemeContext } from '../theme/ThemeContext';
import { fetchUserProfile } from '../services/userService';

export default function AppNavbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggle } = useContext(ThemeContext);
  const [avatarURL, setAvatarURL] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchUserProfile(user.uid)
      .then(profile => {
        setAvatarURL(profile?.avatarURL || '');
        setRole(profile?.role || '');
      })
      .catch(console.error);
  }, [user]);

  return (
    <Navbar expand="md" className="app-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          ToDo
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Главная
            </Nav.Link>
            <Nav.Link as={Link} to="/profile">
              Профиль
            </Nav.Link>
            {role === 'admin' && (
              <Nav.Link as={Link} to="/admin">
                Админ-панель
              </Nav.Link>
            )}
          </Nav>
          <Nav className="align-items-center">
            <Form.Check
              type="switch"
              id="theme-switch"
              label={theme === 'light' ? '🌞' : '🌜'}
              checked={theme === 'dark'}
              onChange={toggle}
              className="me-3"
            />
            {avatarURL && (
              <Image
                src={avatarURL}
                roundedCircle
                width={32}
                height={32}
                className="me-2"
                alt="avatar"
              />
            )}
            <Button variant="outline-danger" size="sm" onClick={logout}>
              Выйти
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}