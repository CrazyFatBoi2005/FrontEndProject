import React, { useState, useEffect } from 'react';
import {
  Container,
  Form,
  Button,
  ListGroup,
  Modal,
  Spinner,
  Pagination
} from 'react-bootstrap';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask
} from '../services/firestoreService';
import AppNavbar from '../components/AppNavbar';
import '../styles/style.css';

export default function MainPage() {
  const [tasks, setTasks]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [newTitle, setNewTitle]     = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [editTask, setEditTask]     = useState(null);
  const [editTitle, setEditTitle]   = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  // фильтры и пагинация
  const [search, setSearch]       = useState('');
  const [sortBy, setSortBy]       = useState('dueDateAsc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // загрузка
  const refresh = async () => {
    setLoading(true);
    try {
      const snapshot = await fetchTasks();
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Ошибка при загрузке задач:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { refresh(); }, []);

  // EDM: фильтрация и сортировка
  const filtered = tasks
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  const sorted = filtered.sort((a, b) => {
    if (sortBy === 'dueDateAsc')  return a.dueDate.localeCompare(b.dueDate);
    if (sortBy === 'dueDateDesc') return b.dueDate.localeCompare(a.dueDate);
    if (sortBy === 'titleAsc')    return a.title.localeCompare(b.title);
    if (sortBy === 'titleDesc')   return b.title.localeCompare(a.title);
    return 0;
  });

  // пагинация
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // CRUD остаётся тот же
  const handleAdd = async e => {
    e.preventDefault();
    if (!newTitle || !newDueDate) return;
    await createTask({ title: newTitle, dueDate: newDueDate, status: 'ToDo' });
    setNewTitle(''); setNewDueDate('');
    await refresh();
  };
  const handleDelete = async id => {
    try {
      await deleteTask(id);
      await refresh();
    } catch (err) {
      console.error('Ошибка удаления задачи:', err);
      alert('Не удалось удалить задачу');
    }
  };
  const handleSaveEdit = async () => {
    await updateTask(editTask.id, { title: editTitle, dueDate: editDueDate });
    setEditTask(null);
    await refresh();
  };

  return (
    <>
      <AppNavbar />
      <Container className="main-container">

        {/* Форма добавления */}
        <div className="add-task-form">
          <h4>Добавить новую задачу</h4>
          <Form onSubmit={handleAdd}>
            <Form.Group className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Крайний срок</Form.Label>
              <Form.Control
                type="date"
                value={newDueDate}
                onChange={e => setNewDueDate(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit">Добавить</Button>
          </Form>
        </div>

        {/* Фильтры */}
        <div className="filters">
          <Form.Control
            className="search"
            placeholder="Поиск по названию"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          />
          <Form.Select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="dueDateAsc">Срок ↑</option>
            <option value="dueDateDesc">Срок ↓</option>
            <option value="titleAsc">Название ↑</option>
            <option value="titleDesc">Название ↓</option>
          </Form.Select>
        </div>

        {/* Список задач */}
        <h2>Запланированные задачи</h2>
        {loading
          ? <div className="text-center py-4"><Spinner animation="border" /></div>
          : (
            <>
              <ListGroup className="task-list">
                {paginated.length
                  ? paginated.map(task => (
                      <ListGroup.Item
                        key={task.id}
                        className="d-flex justify-content-between align-items-center task-item"
                      >
                        <div>
                          <div className="task-title">{task.title}</div>
                          <div className="task-date">Срок: {task.dueDate}</div>
                        </div>
                        <div>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => {
                              setEditTask(task);
                              setEditTitle(task.title);
                              setEditDueDate(task.dueDate);
                            }}
                            className="me-2"
                          >Изменить</Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(task.id)}
                          >Удалить</Button>
                        </div>
                      </ListGroup.Item>
                    ))
                  : <ListGroup.Item className="no-tasks">Нет задач</ListGroup.Item>
                }
              </ListGroup>

              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="pagination-wrapper">
                  <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage===1}/>
                    <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(p-1,1))} disabled={currentPage===1}/>
                    {[...Array(totalPages)].map((_, i) => (
                      <Pagination.Item
                        key={i+1}
                        active={i+1===currentPage}
                        onClick={() => setCurrentPage(i+1)}
                      >
                        {i+1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setCurrentPage(p => Math.min(p+1,totalPages))} disabled={currentPage===totalPages}/>
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage===totalPages}/>
                  </Pagination>
                </div>
              )}
            </>
          )
        }

        {/* Модалка редактирования */}
        <Modal show={!!editTask} onHide={() => setEditTask(null)}>
          <Modal.Header closeButton><Modal.Title>Редактировать задачу</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Название</Form.Label>
                <Form.Control
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Крайний срок</Form.Label>
                <Form.Control
                  type="date"
                  value={editDueDate}
                  onChange={e => setEditDueDate(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditTask(null)}>Отмена</Button>
            <Button variant="primary" onClick={handleSaveEdit}>Сохранить</Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </>
  );
}
