import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const robotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (robotRef.current) {
        robotRef.current.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 8}px)`;
      }
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
      {/* Background */}
      <div className="landing-bg">
        <div className="bg-orb orb-purple" />
        <div className="bg-orb orb-orange" />
        <div className="landing-grid" />
        <div className="stars">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1}s`,
            }} />
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <svg width="36" height="36" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="28" stroke="#7c3aed" strokeWidth="2"/>
            <path d="M20 38 L30 18 L40 38" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 32 H37" stroke="#ff4500" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>LEXORA</span>
        </div>
        <button className="nav-login-btn" onClick={() => navigate('/login')}>Sign In →</button>
      </nav>

      {/* Hero */}
      <div className="landing-hero">
        <div className="hero-text">
          <div className="hero-badge">🇮🇳 AI-Powered Indian Legal Assistant</div>
          <h1>
            Meet <span className="brand-name">Lexora</span>
          </h1>
          <p className="hero-subtitle">
            Your intelligent AI legal companion for Indian law.<br />
            Get instant answers, voice consultations, and legal document assistance.
          </p>
          <div className="hero-actions">
            <button className="hero-btn primary" onClick={() => navigate('/login')}>
              Get Started →
            </button>
            <button className="hero-btn secondary" onClick={() => navigate('/login')}>
              View Demo
            </button>
          </div>

          <div className="hero-features">
            <div className="hero-feat"><span>💬</span> AI Chat</div>
            <div className="hero-feat"><span>🎙️</span> Voice</div>
            <div className="hero-feat"><span>📄</span> Documents</div>
            <div className="hero-feat"><span>⚖️</span> Legal Topics</div>
          </div>
        </div>

        {/* Robot */}
        <div className="hero-visual">
          <div className="robot-container" ref={robotRef}>
            <div className="robot-glow" />
            <svg width="220" height="260" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Body */}
              <rect x="55" y="120" width="110" height="100" rx="20" fill="#1a0a3a" stroke="#7c3aed" strokeWidth="2"/>
              {/* Chest panel */}
              <rect x="75" y="140" width="70" height="50" rx="10" fill="#0f0f2a" stroke="#7c3aed" strokeWidth="1"/>
              {/* Chest light */}
              <circle cx="110" cy="165" r="15" fill="#7c3aed" opacity="0.8"/>
              <circle cx="110" cy="165" r="8" fill="#a855f7"/>
              {/* Head */}
              <rect x="65" y="50" width="90" height="75" rx="20" fill="#1a0a3a" stroke="#7c3aed" strokeWidth="2"/>
              {/* Eyes */}
              <ellipse cx="90" cy="80" rx="12" ry="10" fill="#7c3aed"/>
              <ellipse cx="90" cy="80" rx="7" ry="7" fill="#a855f7"/>
              <ellipse cx="90" cy="80" rx="3" ry="3" fill="white"/>
              <ellipse cx="130" cy="80" rx="12" ry="10" fill="#7c3aed"/>
              <ellipse cx="130" cy="80" rx="7" ry="7" fill="#a855f7"/>
              <ellipse cx="130" cy="80" rx="3" ry="3" fill="white"/>
              {/* Antenna */}
              <line x1="110" y1="50" x2="110" y2="30" stroke="#a855f7" strokeWidth="3"/>
              <circle cx="110" cy="25" r="7" fill="#ff4500"/>
              {/* Mouth */}
              <rect x="88" y="100" width="44" height="8" rx="4" fill="#0a0a1a" stroke="#7c3aed" strokeWidth="1"/>
              <rect x="92" y="102" width="8" height="4" rx="2" fill="#a855f7"/>
              <rect x="104" y="102" width="8" height="4" rx="2" fill="#a855f7"/>
              <rect x="116" y="102" width="8" height="4" rx="2" fill="#a855f7"/>
              {/* Arms */}
              <rect x="20" y="125" width="35" height="18" rx="9" fill="#1a0a3a" stroke="#7c3aed" strokeWidth="1.5"/>
              <rect x="165" y="125" width="35" height="18" rx="9" fill="#1a0a3a" stroke="#7c3aed" strokeWidth="1.5"/>
              {/* Legs */}
              <rect x="75" y="218" width="28" height="35" rx="10" fill="#1a0a3a" stroke="#7c3aed" strokeWidth="1.5"/>
              <rect x="117" y="218" width="28" height="35" rx="10" fill="#1a0a3a" stroke="#7c3aed" strokeWidth="1.5"/>
              {/* Scale icon in hand */}
              <text x="168" y="142" fontSize="14" fill="#ff4500">⚖</text>
            </svg>
          </div>

          <div className="speech-bubble">
            <p>Need quick legal help?</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="landing-features">
        {[
          { icon: '⚖️', title: 'Indian Law Expert', desc: 'Specialized in IPC, CrPC, Family, Property & Corporate law' },
          { icon: '🌐', title: 'Multi-Language', desc: 'Support for English, Hindi, Tamil, Telugu & more' },
          { icon: '🔒', title: 'Secure & Private', desc: 'Your legal queries are always confidential' },
          { icon: '⚡', title: 'Instant Answers', desc: 'Get legal information within seconds, 24/7' },
        ].map(f => (
          <div key={f.title} className="feat-card">
            <span className="feat-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="landing-footer">
        <p>© 2026 Lexora AI • Powered by Azure OpenAI • Made for Indian Citizens</p>
      </div>
    </div>
  );
};

export default LandingPage;
