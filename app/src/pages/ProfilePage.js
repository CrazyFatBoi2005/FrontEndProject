import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';
import { fetchUserProfile, updateUserProfile } from '../services/userService';
import '../styles/style.css';
import AppNavbar from '../components/AppNavbar';

export default function ProfilePage() {
  const { user, changePassword, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // состояния формы
  const [name, setName]           = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [newPass, setNewPass]     = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // сообщения
  const [msgProfile, setMsgProfile]   = useState('');
  const [errProfile, setErrProfile]   = useState('');
  const [msgPass, setMsgPass]         = useState('');
  const [errPass, setErrPass]         = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUserProfile(user.uid);
        setProfile(data);
        setName(data.name);
        setAvatarPreview(data.avatarURL || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user.uid]);

  // конвертируем файл в base64
  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // сохранить имя и аватар
  const handleProfileSubmit = async e => {
    e.preventDefault();
    setErrProfile(''); setMsgProfile('');
      const updates = { name };
      if (avatarPreview) updates.avatarURL = avatarPreview;
      await updateUserProfile(user.uid, updates);
      setMsgProfile('Профиль обновлён');
  };

  const handlePassSubmit = async e => {
  e.preventDefault();
  setErrPass(''); setMsgPass('');

  if (newPass !== confirmPass) {
    setErrPass('Пароли не совпадают');
    return;
  }
  try {
    await changePassword(newPass);
    setMsgPass('Пароль успешно изменён. Перелогиньтесь, чтобы изменения вступили в силу.');
    setTimeout(() => logout(), 2000);
  } catch (err) {
    if (err.message.includes('недавняя аутентификация')) {
      alert(err.message);
    } else {
      setErrPass(err.message);
    }
  }
};

  if (loading) return <><AppNavbar /><div className="text-center mt-5">Загрузка...</div></>;

  return (
    <>
      <AppNavbar />
      <Container className="profile-container">
        <h2>Мой профиль</h2>

        <div className="profile-section">
          {errProfile && <Alert variant="danger">{errProfile}</Alert>}
          {msgProfile && <Alert variant="success">{msgProfile}</Alert>}
          <img
            src={avatarPreview || '/default-avatar.png'}
            alt="Аватар"
            className="profile-avatar"
          />
          <Form className="profile-form" onSubmit={handleProfileSubmit}>
            <Form.Group>
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Аватар (изображение)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Сохранить профиль
            </Button>
          </Form>
        </div>

        <hr />

        <div className="profile-section">
          <h4>Сменить пароль</h4>
          {errPass  && <Alert variant="danger">{errPass}</Alert>}
          {msgPass  && <Alert variant="success">{msgPass}</Alert>}
          <Form onSubmit={handlePassSubmit}>
            <Form.Group>
              <Form.Label>Новый пароль</Form.Label>
              <Form.Control
                type="password"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                required
                minLength={6}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Подтвердите пароль</Form.Label>
              <Form.Control
                type="password"
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                required
                minLength={6}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Сменить пароль
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
}
