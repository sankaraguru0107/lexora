import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { Message, sendChatMessage } from '../services/azureOpenAI';
import './Chat.css';

const suggestedQuestions = [
  'What are my rights as a tenant?',
  'How to file an FIR?',
  'What is Section 498A IPC?',
  'How to register a company in India?',
  'Rights under Consumer Protection Act',
  'What is anticipatory bail?',
];

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Namaste! I'm Lexora, your AI legal assistant specialized in Indian law. I can help you with questions about IPC, CrPC, family law, property law, and more. How may I assist you today?\n\n*Disclaimer: This is general legal information for educational purposes only and does not constitute professional legal advice.*",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const reply = await sendChatMessage(messages, userText);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Sorry, I encountered an error connecting to the AI service. Please check your internet connection and try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color:#a0a0c0;font-size:0.82rem">$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <Layout>
      <div className="chat-page">
        <div className="chat-header">
          <div className="chat-bot-info">
            <div className="bot-avatar">
              <span>🤖</span>
              <div className="online-dot" />
            </div>
            <div>
              <h2>Chat with Lexora</h2>
              <p className="bot-status">● Online • Indian Law Specialist</p>
            </div>
          </div>
          <button className="clear-btn" onClick={() => setMessages([{
            id: '0', role: 'assistant',
            content: "Chat cleared. How can I help you with legal queries today?",
            timestamp: new Date()
          }])}>
            🗑 Clear Chat
          </button>
        </div>

        <div className="messages-area">
          {messages.map((msg, i) => (
            <div key={msg.id} className={`message-wrapper ${msg.role}`} style={{ animationDelay: `${i * 0.05}s` }}>
              {msg.role === 'assistant' && (
                <div className="msg-avatar bot-msg-avatar">⚖️</div>
              )}
              <div className={`message-bubble ${msg.role}`}>
                <div
                  className="message-text"
                  dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                />
                <p className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {msg.role === 'user' && (
                <div className="msg-avatar user-msg-avatar">👤</div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message-wrapper assistant">
              <div className="msg-avatar bot-msg-avatar">⚖️</div>
              <div className="message-bubble assistant">
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="suggestions">
            <p className="suggestions-label">Suggested Questions:</p>
            <div className="suggestions-list">
              {suggestedQuestions.map(q => (
                <button key={q} className="suggestion-btn" onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="chat-input-area">
          <div className="input-container">
            <button className="attach-btn" title="Attach document">📎</button>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type your legal question here..."
              rows={1}
              className="chat-textarea"
            />
            <button
              className={`send-btn ${loading || !input.trim() ? 'disabled' : ''}`}
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              {loading ? '⏳' : '➤'}
            </button>
          </div>
          <p className="input-hint">Press Enter to send • Shift+Enter for new line</p>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
