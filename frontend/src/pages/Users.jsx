import { useState, useEffect } from 'react';
import API from '../api/axios';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '' });
  const [error, setError] = useState('');
  const { user: currentUser, fetchUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users/');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ username: user.username, email: user.email });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.put(`/users/${editingUser.id}`, {
        username: form.username,
        email: form.email,
      });
      setShowModal(false);
      fetchUsers();
      if (editingUser.id === currentUser?.id) {
        fetchUser();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete user');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
        <h2>Users</h2>
        <p>All registered users in the system</p>
      </div>

      <div className="toolbar">
        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          {users.length} user{users.length !== 1 ? 's' : ''}
        </span>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No users found</h3>
          <p>There are no registered users yet.</p>
        </div>
      ) : (
        <div className="user-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-card-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-card-name">
                {user.username}
                {user.id === currentUser?.id && (
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--accent-purple)',
                    marginLeft: '6px',
                    fontWeight: 500,
                  }}>
                    (You)
                  </span>
                )}
              </div>
              <div className="user-card-email">{user.email}</div>
              <div className="user-card-date">
                Joined {formatDate(user.created_at)}
              </div>
              {user.id === currentUser?.id && (
                <div className="user-card-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => openEdit(user)}
                  >
                    ✏️ Edit Profile
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal
          title="Edit Profile"
          onClose={() => setShowModal(false)}
        >
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-input"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
