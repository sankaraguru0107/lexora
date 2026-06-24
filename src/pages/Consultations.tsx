import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import './Consultations.css';

const allConsultations = [
  { id: 1, q: 'How to draft a rental agreement?', category: 'Property Law', date: '10/23/2025', status: 'Resolved', answer: 'A rental agreement in India must include details of landlord, tenant, property, rent amount, duration, and terms.' },
  { id: 2, q: 'Legal steps for starting a small business', category: 'Corporate Law', date: '09/20/2025', status: 'Resolved', answer: 'To start a business in India: 1. Choose business structure 2. Register with MCA 3. Get PAN/TAN 4. GST registration if turnover exceeds threshold.' },
  { id: 3, q: 'Rights of tenant under rent control act', category: 'Property Law', date: '08/15/2025', status: 'Resolved', answer: 'Tenants have rights against arbitrary eviction, right to basic amenities, and fair rent under respective state Rent Control Acts.' },
  { id: 4, q: 'What is Section 498A IPC?', category: 'Criminal Law', date: '07/10/2025', status: 'Resolved', answer: 'Section 498A IPC deals with cruelty by husband or relatives towards a married woman. It is a cognizable and non-bailable offence.' },
  { id: 5, q: 'How to file a consumer complaint?', category: 'Consumer Law', date: '06/05/2025', status: 'Resolved', answer: 'You can file a consumer complaint at District Consumer Commission for claims up to ₹50 lakhs under Consumer Protection Act 2019.' },
];

const ConsultationsPage: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Property Law', 'Criminal Law', 'Corporate Law', 'Consumer Law', 'Family Law'];

  const filtered = filter === 'All' ? allConsultations : allConsultations.filter(c => c.category === filter);

  return (
    <Layout>
      <div className="consultations-page">
        <div className="cons-header">
          <h1>📋 My Consultations</h1>
          <p>View your previous legal queries and AI responses</p>
        </div>

        <div className="cons-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="cons-list">
          {filtered.map(c => (
            <div key={c.id} className={`cons-card ${expanded === c.id ? 'expanded' : ''}`}>
              <div className="cons-card-header" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                <div className="cons-icon">💬</div>
                <div className="cons-main">
                  <p className="cons-question">{c.q}</p>
                  <div className="cons-meta">
                    <span className="cons-cat">{c.category}</span>
                    <span className="cons-date">📅 {c.date}</span>
                    <span className="cons-status resolved">{c.status}</span>
                  </div>
                </div>
                <span className="cons-toggle">{expanded === c.id ? '▲' : '▼'}</span>
              </div>

              {expanded === c.id && (
                <div className="cons-answer fade-in">
                  <p className="answer-label">⚖️ Lexora's Response:</p>
                  <p className="answer-text">{c.answer}</p>
                  <button className="ask-followup" onClick={() => navigate('/chat')}>
                    💬 Ask Follow-up Question →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="new-consultation">
          <h3>Need legal help?</h3>
          <p>Start a new consultation with Lexora AI</p>
          <div className="new-cons-actions">
            <button onClick={() => navigate('/chat')} className="new-btn primary">💬 Chat Consultation</button>
            <button onClick={() => navigate('/voice')} className="new-btn secondary">🎙️ Voice Consultation</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConsultationsPage;
