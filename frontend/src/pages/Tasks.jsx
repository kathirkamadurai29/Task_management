import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Modal from '../components/Modal';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', assigned_to: '', status: 'pending' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users/');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const openCreate = () => {
    setEditingTask(null);
    setForm({ title: '', description: '', assigned_to: '', status: 'pending' });
    setError('');
    setShowModal(true);
  };

  const openEdit = (task, e) => {
    e.stopPropagation();
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || '',
      assigned_to: task.assigned_to || '',
      status: task.status,
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      title: form.title,
      description: form.description || null,
      assigned_to: form.assigned_to ? parseInt(form.assigned_to) : null,
    };

    try {
      if (editingTask) {
        payload.status = form.status;
        await API.put(`/tasks/${editingTask.id}`, payload);
      } else {
        await API.post('/tasks/', payload);
      }
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    }
  };

  const handleDelete = async (taskId, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      'pending': 'badge badge-pending',
      'in progress': 'badge badge-in-progress',
      'completed': 'badge badge-completed',
    };
    return <span className={classes[status] || 'badge'}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>My Tasks</h2>
        <p>Manage and track your tasks</p>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          ➕ New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No tasks yet</h3>
          <p>Create your first task to get started</p>
          <button className="btn btn-primary" onClick={openCreate}>
            ➕ Create Task
          </button>
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="task-card"
              onClick={() => navigate(`/tasks/${task.id}`)}
            >
              <div className="task-title">{task.title}</div>
              {task.description && (
                <div className="task-desc">{task.description}</div>
              )}
              <div className="task-meta">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {getStatusBadge(task.status)}
                  {task.assigned_to_username && (
                    <div className="task-assignee">
                      <div className="mini-avatar">
                        {task.assigned_to_username.charAt(0).toUpperCase()}
                      </div>
                      {task.assigned_to_username}
                    </div>
                  )}
                </div>
                <div className="task-actions">
                  <button
                    className="btn-icon"
                    title="Edit"
                    onClick={(e) => openEdit(task, e)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon"
                    title="Delete"
                    onClick={(e) => handleDelete(task.id, e)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal
          title={editingTask ? 'Edit Task' : 'Create New Task'}
          onClose={() => setShowModal(false)}
        >
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="Task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-textarea"
                placeholder="Task description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Assign To</label>
              <select
                className="form-select"
                value={form.assigned_to}
                onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            {editingTask && (
              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
