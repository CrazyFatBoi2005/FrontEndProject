import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Form,
  Button,
  ListGroup,
  Modal,
  Spinner,
  Pagination,
  Row,
  Col
} from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import Papa from 'papaparse';
import { onSnapshot, query, collection, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import {
  createTask,
  updateTask,
  deleteTask
} from '../services/firestoreService';
import AppNavbar from '../components/AppNavbar';
import { AuthContext } from '../auth/AuthContext';

export default function MainPage() {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [newTitle, setNewTitle]       = useState('');
  const [newDueDate, setNewDueDate]   = useState('');
  const [newPriority, setNewPriority] = useState('SUPER');

  const [editTask, setEditTask]       = useState(null);
  const [editTitle, setEditTitle]     = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPriority, setEditPriority] = useState('SUPER');

  const [search, setSearch]           = useState('');
  const [sortBy, setSortBy]           = useState('dueDateAsc');
  const [statusFilter, setStatusFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // realtime подписка на свои задачи
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'tasks'),
      where('ownerId', '==', user.uid),
      orderBy('dueDate')
    );
    const unsub = onSnapshot(q, snap => {
      const arr = snap.docs.map(d => {
        const data = d.data();
        return { id: d.id, priority: data.priority || 'LOW', ...data };
      });
      setTasks(arr);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleAdd = async e => {
    e.preventDefault();
    await createTask(
      {
        title: newTitle,
        dueDate: newDueDate,
        priority: newPriority,
        status: 'ToDo'
      },
      user.uid
    );
    setNewTitle('');
    setNewDueDate('');
    setNewPriority('SUPER');
  };

  const handleDelete = async id => {
    await deleteTask(id);
  };

  const handleSaveEdit = async () => {
    await updateTask(editTask.id, {
      title: editTitle,
      dueDate: editDueDate,
      priority: editPriority
    });
    setEditTask(null);
  };

  const handleImport = e => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async ({ data }) => {
        for (const row of data) {
          await createTask(
            {
              title: row['Название'],
              dueDate: row['Срок'],
              priority: row['Приоритет'] || 'LOW',
              status: 'ToDo'
            },
            user.uid
          );
        }
      }
    });
  };

  // фильтрация и сортировка
  const filtered = tasks
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    .filter(t => statusFilter === 'all' || t.priority === statusFilter);

  const weight = pri => ({ SUPER: 3, MEDIUM: 2, LOW: 1 }[pri] || 0);
  const sorted = filtered.sort((a, b) => {
    switch (sortBy) {
      case 'priorityAsc':  return weight(b.priority) - weight(a.priority);
      case 'priorityDesc': return weight(a.priority) - weight(b.priority);
      case 'dueDateAsc':   return a.dueDate.localeCompare(b.dueDate);
      case 'dueDateDesc':  return b.dueDate.localeCompare(a.dueDate);
      case 'titleAsc':     return a.title.localeCompare(b.title);
      case 'titleDesc':    return b.title.localeCompare(a.title);
      default:             return 0;
    }
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated  = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <AppNavbar />
      <Container className="main-container">

        {/* Добавление */}
        <div className="add-task-form">
          <h4>Добавить новую задачу</h4>
          <Form onSubmit={handleAdd}>
            <div className="add-task-fields">
              <Form.Control
                type="text"
                placeholder="Название"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
              />
              <Form.Control
                type="date"
                value={newDueDate}
                onChange={e => setNewDueDate(e.target.value)}
                required
              />
              <Form.Select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value)}
              >
                <option value="SUPER">SUPER</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </Form.Select>
            </div>
            <Button type="submit" className="add-task-btn">
              Добавить
            </Button>
            <div className="d-flex gap-2 mt-3">
              <CSVLink
                data={tasks.map(t => ({
                  Название: t.title,
                  Срок: t.dueDate,
                  Приоритет: t.priority
                }))}
                filename="tasks.csv"
                className="btn btn-outline-primary btn-sm"
              >
                Экспорт CSV
              </CSVLink>
              <Form.Control
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="form-control form-control-sm"
              />
            </div>
          </Form>
        </div>

        {/* Фильтры */}
        <div className="filters mb-3">
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
            <option value="priorityAsc">Приоритет ↑</option>
            <option value="priorityDesc">Приоритет ↓</option>
          </Form.Select>
          <Form.Select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">Все приоритеты</option>
            <option value="SUPER">SUPER</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </Form.Select>
        </div>

        {/* Список */}
        <h2 className="mt-4">Запланированные задачи</h2>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <ListGroup className="task-list">
              {paginated.length ? paginated.map(task => (
                <ListGroup.Item key={task.id} className="task-item">
                  <div>
                    <div className="task-title">
                      {task.title}{' '}
                      <span className={`badge-priority badge-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="task-date">Срок: {task.dueDate}</div>
                  </div>
                  <div>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className="me-2"
                      onClick={() => {
                        setEditTask(task);
                        setEditTitle(task.title);
                        setEditDueDate(task.dueDate);
                        setEditPriority(task.priority);
                      }}
                    >
                      Изменить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(task.id)}
                    >
                      Удалить
                    </Button>
                  </div>
                </ListGroup.Item>
              )) : (
                <ListGroup.Item className="no-tasks">Нет задач</ListGroup.Item>
              )}
            </ListGroup>

            {totalPages > 1 && (
              <div className="pagination-wrapper">
                <Pagination className="justify-content-center">
                  <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage===1} />
                  <Pagination.Prev onClick={() => setCurrentPage(p=>Math.max(p-1,1))} disabled={currentPage===1} />
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                      key={i+1}
                      active={i+1===currentPage}
                      onClick={() => setCurrentPage(i+1)}
                    >
                      {i+1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setCurrentPage(p=>Math.min(p+1,totalPages))} disabled={currentPage===totalPages} />
                  <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage===totalPages} />
                </Pagination>
              </div>
            )}
          </>
        )}

        {/* Редактирование */}
        <Modal show={!!editTask} onHide={() => setEditTask(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Редактировать задачу</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="g-2">
                <Col xs={12} md={6}>
                  <Form.Control
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                  />
                </Col>
                <Col xs={6} md={3}>
                  <Form.Control
                    type="date"
                    value={editDueDate}
                    onChange={e => setEditDueDate(e.target.value)}
                  />
                </Col>
                <Col xs={6} md={3}>
                  <Form.Select
                    value={editPriority}
                    onChange={e => setEditPriority(e.target.value)}
                  >
                    <option value="SUPER">SUPER</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </Form.Select>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditTask(null)}>
              Отмена
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Сохранить
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </>
  );
}
