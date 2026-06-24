import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

interface NavItem { icon: string; label: string; path: string; }

const userNav: NavItem[] = [
  { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
  { icon: '💬', label: 'Chat with Lexora', path: '/chat' },
  { icon: '🎙️', label: 'Voice Assistant', path: '/voice' },
  { icon: '⚖️', label: 'Legal Topics', path: '/topics' },
  { icon: '📋', label: 'My Consultations', path: '/consultations' },
  { icon: '📄', label: 'Document Helper', path: '/documents' },
];

const advocateNav: NavItem[] = [
  { icon: '🏠', label: 'Dashboard', path: '/advocate' },
  { icon: '👥', label: 'Clients', path: '/advocate/clients' },
  { icon: '💬', label: 'AI Research', path: '/chat' },
  { icon: '📋', label: 'Cases', path: '/advocate/cases' },
  { icon: '⚖️', label: 'Legal Database', path: '/topics' },
  { icon: '📝', label: 'Draft Documents', path: '/documents' },
];

const adminNav: NavItem[] = [
  { icon: '🛡️', label: 'Admin Panel', path: '/admin' },
  { icon: '👥', label: 'Manage Users', path: '/admin/users' },
  { icon: '📊', label: 'Analytics', path: '/admin/analytics' },
  { icon: '⚙️', label: 'Settings', path: '/admin/settings' },
  { icon: '📋', label: 'Audit Logs', path: '/admin/logs' },
];

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'advocate' ? advocateNav : userNav;

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo" onClick={() => navigate('/dashboard')}>
          <div className="logo-mark">
            <svg width="32" height="32" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" stroke="#7c3aed" strokeWidth="2"/>
              <path d="M20 38 L30 18 L40 38" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 32 H37" stroke="#ff4500" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          {!collapsed && <span className="sidebar-brand">LEXORA</span>}
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {!collapsed && user && (
        <div className="user-info">
          <div className="user-avatar">{user.name.charAt(0)}</div>
          <div className="user-details">
            <p className="user-name">{user.name}</p>
            <span className={`user-role role-${user.role}`}>{user.role}</span>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            title={collapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {location.pathname === item.path && <div className="active-indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={() => { logout(); navigate('/'); }}>
          <span>🚪</span>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
