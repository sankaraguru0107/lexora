import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import './AdvocateDashboard.css';

const clients = [
  { name: 'Ramesh Kumar', case: 'Property Dispute', status: 'Active', date: '12 Apr 2026' },
  { name: 'Sunita Devi', case: 'Divorce Proceedings', status: 'Active', date: '10 Apr 2026' },
  { name: 'Arjun Mehta', case: 'Labour Dispute', status: 'Pending', date: '08 Apr 2026' },
  { name: 'Priya Nair', case: 'Consumer Complaint', status: 'Resolved', date: '05 Apr 2026' },
];

const recentResearch = [
  { topic: 'Anticipatory bail under Section 438 CrPC', time: '2 hours ago' },
  { topic: 'Hindu Succession Act amendments 2005', time: '1 day ago' },
  { topic: 'RERA compliance requirements', time: '3 days ago' },
];

const AdvocateDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="adv-dashboard">
        <div className="adv-header">
          <div>
            <p className="adv-role">⚖️ Advocate Portal</p>
            <h1>Welcome, {user?.name}</h1>
            <p className="adv-sub">Manage your clients and leverage AI for legal research</p>
          </div>
          <div className="adv-stats-mini">
            <div className="mini-stat"><span className="mini-num">4</span><span>Active Cases</span></div>
            <div className="mini-stat"><span className="mini-num">12</span><span>Total Clients</span></div>
            <div className="mini-stat"><span className="mini-num">89%</span><span>Success Rate</span></div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="adv-actions">
          <button className="adv-action-btn primary" onClick={() => navigate('/chat')}>
            <span>🤖</span>
            <div><strong>AI Legal Research</strong><p>Ask Lexora for case references</p></div>
          </button>
          <button className="adv-action-btn" onClick={() => navigate('/documents')}>
            <span>📝</span>
            <div><strong>Draft Documents</strong><p>Generate legal documents</p></div>
          </button>
          <button className="adv-action-btn" onClick={() => navigate('/topics')}>
            <span>⚖️</span>
            <div><strong>Legal Database</strong><p>Browse acts and sections</p></div>
          </button>
          <button className="adv-action-btn" onClick={() => navigate('/voice')}>
            <span>🎙️</span>
            <div><strong>Voice Research</strong><p>Hands-free legal queries</p></div>
          </button>
        </div>

        <div className="adv-grid">
          {/* Clients */}
          <div className="adv-card">
            <div className="adv-card-header">
              <h2>👥 Recent Clients</h2>
              <button className="adv-view-all">View All</button>
            </div>
            <div className="clients-table">
              <div className="table-head">
                <span>Client</span><span>Case Type</span><span>Status</span><span>Date</span>
              </div>
              {clients.map(c => (
                <div key={c.name} className="table-row">
                  <div className="client-name">
                    <div className="client-av">{c.name.charAt(0)}</div>
                    {c.name}
                  </div>
                  <span className="case-type">{c.case}</span>
                  <span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span>
                  <span className="case-date">{c.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Research */}
          <div className="adv-card">
            <div className="adv-card-header">
              <h2>🔬 Recent Research</h2>
              <button className="adv-view-all" onClick={() => navigate('/chat')}>Open AI Chat</button>
            </div>
            <div className="research-list">
              {recentResearch.map(r => (
                <div key={r.topic} className="research-item" onClick={() => navigate('/chat')}>
                  <div className="research-icon">📚</div>
                  <div className="research-info">
                    <p className="research-topic">{r.topic}</p>
                    <p className="research-time">{r.time}</p>
                  </div>
                  <span className="research-arrow">→</span>
                </div>
              ))}
            </div>

            <div className="ai-research-prompt">
              <p>🤖 Ask Lexora for case law, sections, or legal analysis</p>
              <button onClick={() => navigate('/chat')} className="start-research-btn">Start Research →</button>
            </div>
          </div>
        </div>

        {/* Court calendar hint */}
        <div className="adv-calendar-banner">
          <div className="cal-icon">📅</div>
          <div>
            <h3>Upcoming Hearings</h3>
            <p>3 hearings scheduled this week • Next: Ramesh Kumar vs State — 21 Apr 2026</p>
          </div>
          <button className="cal-btn">View Calendar →</button>
        </div>
      </div>
    </Layout>
  );
};

export default AdvocateDashboard;
