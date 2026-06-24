import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/dashboard/');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.total_users ?? 0, icon: '👥', color: 'purple' },
    { label: 'Total Tasks', value: stats?.total_tasks ?? 0, icon: '📋', color: 'blue' },
    { label: 'Pending', value: stats?.pending_tasks ?? 0, icon: '⏳', color: 'orange' },
    { label: 'In Progress', value: stats?.in_progress_tasks ?? 0, icon: '🔄', color: 'teal' },
    { label: 'Completed', value: stats?.completed_tasks ?? 0, icon: '✅', color: 'pink' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your task management system</p>
      </div>

      <div className="stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className={`stat-card ${card.color}`}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
