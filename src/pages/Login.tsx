import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import './Login.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await login(email, password, role);
    setLoading(false);
    if (success) {
      navigate(role === 'admin' ? '/admin' : role === 'advocate' ? '/advocate' : '/dashboard');
    } else {
      setError('Invalid credentials. Please check email, password and role.');
    }
  };

  const fillDemo = (r: UserRole) => {
    const creds: Record<UserRole, { email: string; pass: string }> = {
      user: { email: 'user@lexora.ai', pass: 'user123' },
      advocate: { email: 'advocate@lexora.ai', pass: 'advocate123' },
      admin: { email: 'admin@lexora.ai', pass: 'admin123' },
    };
    setEmail(creds[r].email);
    setPassword(creds[r].pass);
    setRole(r);
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="bg-effects">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="grid-overlay" />
      </div>

      <div className="login-container">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo-icon">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" stroke="#7c3aed" strokeWidth="2" />
              <circle cx="30" cy="30" r="20" stroke="#ff4500" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M20 38 L30 18 L40 38" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M23 32 H37" stroke="#ff4500" strokeWidth="2" strokeLinecap="round" />
              <circle cx="30" cy="18" r="3" fill="#a855f7" />
            </svg>
          </div>
          <h1 className="logo-title">LEXORA</h1>
          <p className="logo-subtitle">AI-Powered Legal Assistant</p>
        </div>

        {/* Role selector */}
        <div className="role-tabs">
          {(['user', 'advocate', 'admin'] as UserRole[]).map(r => (
            <button
              key={r}
              className={`role-tab ${role === r ? 'active' : ''}`}
              onClick={() => setRole(r)}
            >
              {r === 'user' ? '👤 User' : r === 'advocate' ? '⚖️ Advocate' : '🛡️ Admin'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={`Enter your ${role} email`}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && <div className="error-msg">⚠ {error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="demo-section">
          <p className="demo-label">Quick Demo Login:</p>
          <div className="demo-buttons">
            <button onClick={() => fillDemo('user')} className="demo-btn">User</button>
            <button onClick={() => fillDemo('advocate')} className="demo-btn">Advocate</button>
            <button onClick={() => fillDemo('admin')} className="demo-btn">Admin</button>
          </div>
        </div>

        <div className="footer-text">
          <p>🔐 Secure • Confidential • Indian Law Specialized</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
