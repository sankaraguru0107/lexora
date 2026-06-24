import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import './Dashboard.css';

const legalTopics = [
  { icon: '❤️', name: 'Family Law', desc: 'Marriage, Divorce, Adoption', color: '#e91e63' },
  { icon: '📋', name: 'Contract Law', desc: 'Agreements, Business', color: '#2196f3' },
  { icon: '🏠', name: 'Property Law', desc: 'Real Estate, Land Laws', color: '#4caf50' },
  { icon: '👷', name: 'Labour Law', desc: 'Employment Rights, Wages', color: '#ff9800' },
  { icon: '🏢', name: 'Corporate Law', desc: 'Companies Act, GST', color: '#9c27b0' },
  { icon: '🛡️', name: 'Consumer Law', desc: 'Consumer Protection', color: '#00bcd4' },
  { icon: '⚖️', name: 'Criminal Law', desc: 'IPC, CrPC, Bail', color: '#f44336' },
  { icon: '📜', name: 'Constitutional', desc: 'Fundamental Rights', color: '#ff5722' },
];

const recentConsultations = [
  { q: 'How to draft a rental agreement?', date: '10/23/2025', status: 'Resolved' },
  { q: 'Legal steps for starting a small business', date: '09/20/2025', status: 'Resolved' },
  { q: 'Rights of tenant under rent control act', date: '08/15/2025', status: 'Resolved' },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="dashboard">
        {/* Header */}
        <div className="dash-header">
          <div className="header-decoration" />
          <div className="header-content">
            <div>
              <p className="welcome-text">Welcome back,</p>
              <h1 className="welcome-name">{user?.name} <span className="wave">👋</span></h1>
              <p className="welcome-sub">Your AI Legal Assistant is ready to help</p>
            </div>
            <div className="header-badge">
              <div className="badge-icon">⚖️</div>
              <div>
                <p className="badge-title">Legal Assistant</p>
                <p className="badge-sub">Powered by AI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="action-cards">
          <div className="action-card chat-card" onClick={() => navigate('/chat')}>
            <div className="action-icon">💬</div>
            <div className="action-info">
              <h3>Chat with Lexora</h3>
              <p>Type your legal questions</p>
            </div>
            <div className="action-arrow">→</div>
          </div>
          <div className="action-card voice-card" onClick={() => navigate('/voice')}>
            <div className="action-icon">🎙️</div>
            <div className="action-info">
              <h3>Talk with Lexora</h3>
              <p>Voice consultation available</p>
            </div>
            <div className="action-arrow">→</div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-num">12</span>
            <span className="stat-label">Consultations</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">8</span>
            <span className="stat-label">Topics Explored</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">3</span>
            <span className="stat-label">Documents</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">5★</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>

        <div className="dash-grid">
          {/* Legal Topics */}
          <div className="section-card">
            <div className="section-header">
              <h2>Legal Topics</h2>
              <button className="view-all" onClick={() => navigate('/topics')}>View All →</button>
            </div>
            <div className="topics-grid">
              {legalTopics.map(topic => (
                <div
                  key={topic.name}
                  className="topic-chip"
                  onClick={() => navigate('/topics')}
                  style={{ '--topic-color': topic.color } as React.CSSProperties}
                >
                  <span className="topic-icon">{topic.icon}</span>
                  <div>
                    <p className="topic-name">{topic.name}</p>
                    <p className="topic-desc">{topic.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Consultations */}
          <div className="section-card">
            <div className="section-header">
              <h2>Recent Consultations</h2>
              <button className="view-all" onClick={() => navigate('/consultations')}>View All →</button>
            </div>
            <div className="consultations-list">
              {recentConsultations.map((c, i) => (
                <div key={i} className="consultation-item" onClick={() => navigate('/chat')}>
                  <div className="consult-icon">💬</div>
                  <div className="consult-info">
                    <p className="consult-q">{c.q}</p>
                    <p className="consult-date">Date: {c.date}</p>
                  </div>
                  <span className="consult-status">{c.status}</span>
                </div>
              ))}
            </div>

            {/* Quick Ask */}
            <div className="quick-ask" onClick={() => navigate('/chat')}>
              <span>🔍 Ask a legal question...</span>
              <span className="quick-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
