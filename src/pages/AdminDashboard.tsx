import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import './AdminDashboard.css';

const users = [
  { id: 1, name: 'Rahul Sharma', email: 'user@lexora.ai', role: 'user', status: 'Active', joined: '01 Jan 2026', queries: 45 },
  { id: 2, name: 'Adv. Priya Nair', email: 'advocate@lexora.ai', role: 'advocate', status: 'Active', joined: '15 Feb 2026', queries: 120 },
  { id: 3, name: 'Vikram Singh', email: 'vikram@example.com', role: 'user', status: 'Active', joined: '20 Mar 2026', queries: 28 },
  { id: 4, name: 'Meera Patel', email: 'meera@example.com', role: 'user', status: 'Inactive', joined: '05 Apr 2026', queries: 5 },
  { id: 5, name: 'Adv. Suresh Iyer', email: 'suresh@example.com', role: 'advocate', status: 'Active', joined: '10 Apr 2026', queries: 87 },
];

const activityLogs = [
  { user: 'Rahul Sharma', action: 'Chat Query: Family Law', time: '5 min ago' },
  { user: 'Adv. Priya Nair', action: 'Voice Consultation: Criminal Law', time: '15 min ago' },
  { user: 'Vikram Singh', action: 'Viewed Legal Topic: Property Law', time: '1 hr ago' },
  { user: 'Meera Patel', action: 'Login', time: '2 hrs ago' },
  { user: 'Adv. Suresh Iyer', action: 'Document Draft: Rent Agreement', time: '3 hrs ago' },
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs'>('overview');

  return (
    <Layout>
      <div className="admin-dashboard">
        <div className="admin-header">
          <div>
            <p className="admin-role">🛡️ Administrator Panel</p>
            <h1>System Overview</h1>
            <p className="admin-sub">Logged in as: {user?.name} • {user?.email}</p>
          </div>
          <div className="system-status">
            <div className="status-dot active" />
            <div>
              <p className="status-label">All Systems Operational</p>
              <p className="status-sub">Azure OpenAI • API • Database</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats">
          {[
            { icon: '👥', label: 'Total Users', value: '1,247', change: '+12%', up: true },
            { icon: '⚖️', label: 'Advocates', value: '89', change: '+5%', up: true },
            { icon: '💬', label: 'Total Queries', value: '28,456', change: '+23%', up: true },
            { icon: '🎙️', label: 'Voice Sessions', value: '3,891', change: '+18%', up: true },
            { icon: '📋', label: 'Documents', value: '654', change: '+8%', up: true },
            { icon: '⚡', label: 'API Calls Today', value: '4,120', change: '-3%', up: false },
          ].map(s => (
            <div key={s.label} className="admin-stat-card">
              <div className="admin-stat-icon">{s.icon}</div>
              <div className="admin-stat-info">
                <p className="admin-stat-value">{s.value}</p>
                <p className="admin-stat-label">{s.label}</p>
              </div>
              <span className={`admin-stat-change ${s.up ? 'up' : 'down'}`}>{s.change}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {(['overview', 'users', 'logs'] as const).map(t => (
            <button
              key={t}
              className={`admin-tab ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t === 'overview' ? '📊 Overview' : t === 'users' ? '👥 Manage Users' : '📋 Audit Logs'}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="admin-overview">
            <div className="overview-card">
              <h3>📈 Query Volume (Last 7 Days)</h3>
              <div className="bar-chart">
                {[65, 80, 55, 90, 70, 85, 95].map((h, i) => (
                  <div key={i} className="bar-col">
                    <div className="bar" style={{ height: `${h}%` }} />
                    <span>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="overview-card">
              <h3>⚖️ Query Distribution</h3>
              <div className="dist-list">
                {[
                  { name: 'Family Law', pct: 28, color: '#e91e63' },
                  { name: 'Criminal Law', pct: 22, color: '#f44336' },
                  { name: 'Property Law', pct: 18, color: '#4caf50' },
                  { name: 'Contract Law', pct: 14, color: '#2196f3' },
                  { name: 'Others', pct: 18, color: '#9c27b0' },
                ].map(d => (
                  <div key={d.name} className="dist-item">
                    <span className="dist-name">{d.name}</span>
                    <div className="dist-bar">
                      <div className="dist-fill" style={{ width: `${d.pct}%`, background: d.color }} />
                    </div>
                    <span className="dist-pct">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-table-container">
            <div className="users-table-head">
              <span>User</span><span>Email</span><span>Role</span><span>Queries</span><span>Status</span><span>Joined</span><span>Action</span>
            </div>
            {users.map(u => (
              <div key={u.id} className="users-table-row">
                <div className="user-cell">
                  <div className="user-av">{u.name.charAt(0)}</div>
                  {u.name}
                </div>
                <span className="user-email">{u.email}</span>
                <span className={`role-chip role-${u.role}`}>{u.role}</span>
                <span className="user-queries">{u.queries}</span>
                <span className={`user-status ${u.status.toLowerCase()}`}>{u.status}</span>
                <span className="user-joined">{u.joined}</span>
                <div className="user-actions">
                  <button className="action-icon-btn edit">✏️</button>
                  <button className="action-icon-btn delete">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="logs-container">
            {activityLogs.map((log, i) => (
              <div key={i} className="log-item">
                <div className="log-dot" />
                <div className="log-info">
                  <p className="log-user">{log.user}</p>
                  <p className="log-action">{log.action}</p>
                </div>
                <span className="log-time">{log.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
