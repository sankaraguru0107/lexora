import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import './Topics.css';

const topicsData = [
  {
    icon: '❤️', name: 'Family Law', color: '#e91e63',
    desc: 'Marriage, Divorce, Adoption, Succession, Maintenance',
    details: 'Family Law in India is governed by personal laws based on religion, as well as secular laws. It covers marriage, divorce, adoption, guardianship, maintenance, and succession.',
    acts: ['Hindu Marriage Act, 1955', 'Muslim Personal Law (Shariat) Application Act, 1937', 'Christian Marriage Act, 1872', 'Special Marriage Act, 1954', 'Hindu Succession Act, 1956', 'Guardian and Wards Act, 1890'],
    faqs: ['How to file for divorce?', 'What is maintenance under Section 125 CrPC?', 'Adoption eligibility criteria', 'Property rights of women after marriage'],
  },
  {
    icon: '🔫', name: 'Criminal Law', color: '#f44336',
    desc: 'IPC, CrPC, Bail, FIR, Criminal Procedures',
    details: 'Criminal law in India is primarily governed by the Indian Penal Code (IPC) 1860, Code of Criminal Procedure (CrPC) 1973, and the Indian Evidence Act 1872.',
    acts: ['Indian Penal Code (IPC), 1860', 'Code of Criminal Procedure (CrPC), 1973', 'Indian Evidence Act, 1872', 'Prevention of Corruption Act, 1988', 'NDPS Act, 1985', 'POCSO Act, 2012'],
    faqs: ['How to file an FIR?', 'What is anticipatory bail?', 'Rights of an arrested person', 'What is Section 498A IPC?'],
  },
  {
    icon: '🏠', name: 'Property Law', color: '#4caf50',
    desc: 'Real Estate, Transfer of Property, Land Laws, Tenancy',
    details: 'Property law governs the ownership, transfer, and use of property in India. It includes movable and immovable property rights.',
    acts: ['Transfer of Property Act, 1882', 'Registration Act, 1908', 'Real Estate (Regulation and Development) Act, 2016', 'Land Acquisition Act, 2013', 'Rent Control Acts (State-wise)', 'Benami Transactions (Prohibition) Act'],
    faqs: ['How to register a property?', 'What is RERA?', 'Rights of tenant vs landlord', 'How to contest property dispute?'],
  },
  {
    icon: '📋', name: 'Contract Law', color: '#2196f3',
    desc: 'Indian Contract Act, Agreements, Business Contracts',
    details: 'Contract law deals with legally binding agreements between parties. The Indian Contract Act, 1872 is the primary legislation governing contracts.',
    acts: ['Indian Contract Act, 1872', 'Specific Relief Act, 1963', 'Sale of Goods Act, 1930', 'Arbitration and Conciliation Act, 1996', 'Information Technology Act, 2000'],
    faqs: ['What makes a contract valid?', 'How to enforce a contract?', 'What is breach of contract?', 'Can verbal agreements be enforced?'],
  },
  {
    icon: '👷', name: 'Labour Law', color: '#ff9800',
    desc: 'Employment Rights, Wages, Industrial Disputes, PF, ESI',
    details: 'Labour laws in India protect the rights of workers and regulate the relationship between employers and employees.',
    acts: ['Industrial Disputes Act, 1947', 'Minimum Wages Act, 1948', 'Payment of Wages Act, 1936', 'Employees Provident Fund Act, 1952', 'Maternity Benefit Act, 1961', 'Code on Wages, 2019'],
    faqs: ['What is minimum wage?', 'Rights during wrongful termination', 'Maternity leave entitlements', 'How to file a labour complaint?'],
  },
  {
    icon: '🏢', name: 'Corporate Law', color: '#9c27b0',
    desc: 'Companies Act, Business Registration, Compliance, GST',
    details: 'Corporate law governs the formation, operation, and dissolution of companies in India under the Companies Act 2013.',
    acts: ['Companies Act, 2013', 'Limited Liability Partnership Act, 2008', 'Goods and Services Tax Act, 2017', 'SEBI Act, 1992', 'Competition Act, 2002', 'Insolvency and Bankruptcy Code, 2016'],
    faqs: ['How to register a company?', 'Difference between Pvt Ltd and LLP?', 'GST registration process', 'Director liabilities and duties'],
  },
  {
    icon: '🛡️', name: 'Consumer Law', color: '#00bcd4',
    desc: 'Consumer Protection, Rights, Grievance Redressal',
    details: 'Consumer law protects buyers of goods and services from unfair trade practices, defective products, and deficient services.',
    acts: ['Consumer Protection Act, 2019', 'Food Safety and Standards Act, 2006', 'Bureau of Indian Standards Act', 'Legal Metrology Act, 2009', 'E-commerce Rules, 2020'],
    faqs: ['How to file consumer complaint?', 'What is the complaint limit for District Forum?', 'Rights of online shoppers', 'Product liability claims'],
  },
  {
    icon: '📜', name: 'Constitutional Law', color: '#ff5722',
    desc: 'Fundamental Rights, Directives, Constitutional Remedies',
    details: 'Constitutional law deals with the interpretation and implementation of the Indian Constitution, the supreme law of India.',
    acts: ['Constitution of India, 1950', 'Article 32 - Constitutional Remedies', 'Article 226 - High Court Writ Jurisdiction', 'Right to Information Act, 2005', 'Protection of Human Rights Act, 1993'],
    faqs: ['What are fundamental rights?', 'How to file a PIL?', 'What is Article 370?', 'Right to information procedure'],
  },
];

const TopicsPage: React.FC = () => {
  const [selected, setSelected] = useState<typeof topicsData[0] | null>(null);
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="topics-page">
        <div className="topics-header">
          <h1>Legal Topics</h1>
          <p>Explore Indian Law Categories</p>
        </div>

        <div className="topics-main-grid">
          {topicsData.map(topic => (
            <div
              key={topic.name}
              className={`topic-card ${selected?.name === topic.name ? 'selected' : ''}`}
              onClick={() => setSelected(selected?.name === topic.name ? null : topic)}
              style={{ '--color': topic.color } as React.CSSProperties}
            >
              <div className="topic-card-icon">{topic.icon}</div>
              <div className="topic-card-body">
                <h3>{topic.name}</h3>
                <p>{topic.desc}</p>
              </div>
              <span className="topic-card-arrow">{selected?.name === topic.name ? '▲' : '▼'}</span>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="topic-detail-panel fade-in">
            <div className="detail-header" style={{ borderColor: selected.color }}>
              <span className="detail-icon">{selected.icon}</span>
              <div>
                <h2>{selected.name}</h2>
                <p className="detail-sub">Detailed Information</p>
              </div>
              <button className="close-detail" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="detail-grid">
              <div className="detail-section">
                <h4>Overview</h4>
                <p>{selected.details}</p>
              </div>

              <div className="detail-section">
                <h4>🔑 Key Acts & Regulations</h4>
                <ul className="acts-list">
                  {selected.acts.map(act => (
                    <li key={act}>{act}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h4>❓ Frequently Asked Questions</h4>
                <div className="faq-list">
                  {selected.faqs.map(faq => (
                    <button
                      key={faq}
                      className="faq-item"
                      onClick={() => navigate('/chat', { state: { query: faq } })}
                    >
                      <span>💬</span> {faq}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="detail-actions">
              <button className="detail-btn primary" onClick={() => navigate('/chat')}>
                💬 Ask Lexora about {selected.name}
              </button>
              <button className="detail-btn secondary" onClick={() => navigate('/voice')}>
                🎙️ Voice Consultation
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TopicsPage;
