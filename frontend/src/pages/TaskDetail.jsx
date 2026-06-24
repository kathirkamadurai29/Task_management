import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const res = await API.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Task not found');
    } finally {
      setLoading(false);
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

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-icon">❌</div>
        <h3>{error}</h3>
        <p>The task you're looking for doesn't exist or you don't have access.</p>
        <button className="btn btn-primary" onClick={() => navigate('/tasks')}>
          ← Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/tasks')}
          style={{ marginBottom: '16px' }}
        >
          ← Back to Tasks
        </button>
        <h2>{task.title}</h2>
      </div>

      <div className="detail-grid">
        <div className="glass-card">
          <div className="detail-field">
            <div className="detail-label">Description</div>
            <div className="detail-value">
              {task.description || 'No description provided'}
            </div>
          </div>

          <div className="detail-field">
            <div className="detail-label">Status</div>
            <div className="detail-value">{getStatusBadge(task.status)}</div>
          </div>
        </div>

        <div>
          <div className="glass-card" style={{ marginBottom: '16px' }}>
            <div className="detail-field">
              <div className="detail-label">Created By</div>
              <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="mini-avatar" style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'var(--gradient-primary)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: '700', color: 'white'
                }}>
                  {task.creator_username?.charAt(0).toUpperCase()}
                </div>
                {task.creator_username || `User #${task.creator_id}`}
              </div>
            </div>

            <div className="detail-field">
              <div className="detail-label">Assigned To</div>
              <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {task.assigned_to_username ? (
                  <>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'var(--gradient-accent)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: '700', color: 'white'
                    }}>
                      {task.assigned_to_username.charAt(0).toUpperCase()}
                    </div>
                    {task.assigned_to_username}
                  </>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="detail-field">
              <div className="detail-label">Created At</div>
              <div className="detail-value">{formatDate(task.created_at)}</div>
            </div>

            <div className="detail-field" style={{ marginBottom: 0 }}>
              <div className="detail-label">Updated At</div>
              <div className="detail-value">{formatDate(task.updated_at)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
