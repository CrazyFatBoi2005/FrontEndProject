import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Container, Nav, Button, Image } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';
import { fetchUserProfile } from '../services/userService';

export default function AppNavbar() {
  const { user, logout } = useContext(AuthContext);
  const [avatarURL, setAvatarURL] = useState('');

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const profile = await fetchUserProfile(user.uid);
        setAvatarURL(profile?.avatarURL || '');
      } catch (err) {
        console.error('Не удалось загрузить аватар:', err);
      }
    })();
  }, [user]);

  return (
    <Navbar bg="light" expand="md" className="app-navbar">
      <Container>
        <Navbar.Brand href="/">ToDo</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Главная</Nav.Link>
            <Nav.Link href="/profile">Профиль</Nav.Link>
          </Nav>
          <Nav className="align-items-center">
            {avatarURL
              ? (
                <Image 
                  src={avatarURL} 
                  roundedCircle 
                  width={32} 
                  height={32} 
                  className="me-2"
                  alt="avatar"
                />
              )
              : (
                <div className="me-2" style={{
                  width: 32, height: 32, 
                  background: '#ccc', borderRadius: '50%'
                }} />
              )
            }
            <Button
              variant="outline-danger"
              size="sm"
              onClick={logout}
            >
              Выйти
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}