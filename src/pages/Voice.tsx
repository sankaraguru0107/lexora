import React, { useState, useRef, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { Message, sendChatMessage, textToSpeech } from '../services/azureOpenAI';
import './Voice.css';

const AUTO_LISTEN_DELAY_MS = 450;

const languages = [
  { code: 'en-IN', label: 'English' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'ml-IN', label: 'Malayalam' },
];

const VoicePage: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [messages, setMessages] = useState<Message[]>([]);
  const [statusText, setStatusText] = useState('Tap the microphone to speak');
  const [autoContinue, setAutoContinue] = useState(true);

  const recognitionRef = useRef<any>(null);
  const messagesRef = useRef<Message[]>([]);
  const transcriptRef = useRef('');
  const skipAutoListenRef = useRef(false);
  const autoContinueRef = useRef(true);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  messagesRef.current = messages;
  autoContinueRef.current = autoContinue;

  const startListeningRef = useRef<() => void>(() => {});

  const processQuery = useCallback(async (query: string) => {
    if (!query.trim() || skipAutoListenRef.current) return;
    setIsProcessing(true);
    setStatusText('Processing your query...');

    try {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: query,
        timestamp: new Date(),
      };
      const prior = messagesRef.current;
      const newMessages = [...prior, userMsg];
      messagesRef.current = newMessages;
      setMessages(newMessages);

      const reply = await sendChatMessage(prior, query);
      if (skipAutoListenRef.current) {
        messagesRef.current = prior;
        setMessages(prior);
        setIsProcessing(false);
        return;
      }
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      const withAssistant = [...newMessages, assistantMsg];
      messagesRef.current = withAssistant;
      setMessages(withAssistant);
      setResponse(reply);
      setIsProcessing(false);

      setIsSpeaking(true);
      setStatusText('Speaking the response...');
      const cleanReply = reply.replace(/\*[^*]+\*/g, '').replace(/\n/g, ' ');
      await textToSpeech(cleanReply);
      setIsSpeaking(false);

      if (skipAutoListenRef.current) {
        setStatusText('Tap the microphone to speak');
        return;
      }

      if (autoContinueRef.current && !skipAutoListenRef.current) {
        setStatusText('Listening for your next question...');
        window.setTimeout(() => {
          if (!skipAutoListenRef.current && autoContinueRef.current) {
            startListeningRef.current?.();
          }
        }, AUTO_LISTEN_DELAY_MS);
      } else {
        setStatusText('Tap the microphone to speak');
      }
    } catch {
      setIsProcessing(false);
      setResponse('Sorry, I encountered an error. Please try again.');
      setStatusText('Error occurred. Please try again.');
    }
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isProcessing) return;

    skipAutoListenRef.current = false;

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      transcriptRef.current = '';
      setResponse('');
      setStatusText('Listening… speak your legal question');
    };

    recognition.onresult = (event: any) => {
      const full = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setTranscript(full);
      transcriptRef.current = full;
    };

    recognition.onend = () => {
      setIsListening(false);
      const finalText = transcriptRef.current.trim();
      if (finalText) {
        void processQuery(finalText);
      } else {
        setStatusText('No speech detected. Try again.');
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error === 'aborted' || e.error === 'no-speech') {
        setIsListening(false);
        if (e.error === 'no-speech') {
          setStatusText('No speech heard. Tap the mic to try again.');
        }
        return;
      }
      setIsListening(false);
      setStatusText(`Error: ${e.error}. Please try again.`);
    };

    try {
      recognition.start();
    } catch {
      setStatusText('Could not start microphone. Try again.');
    }
  }, [isProcessing, selectedLanguage, processQuery]);

  startListeningRef.current = startListening;

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          /* ignore */
        }
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, response]);

  const stopListening = () => {
    skipAutoListenRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    window.speechSynthesis.cancel();
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    setStatusText('Tap the microphone to speak');
  };

  const clearConversation = () => {
    skipAutoListenRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    window.speechSynthesis.cancel();
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    setMessages([]);
    messagesRef.current = [];
    setTranscript('');
    transcriptRef.current = '';
    setResponse('');
    setStatusText('Tap the microphone to start a new conversation');
  };

  const speakResponseAgain = () => {
    if (!response) return;
    setIsSpeaking(true);
    const clean = response.replace(/\*[^*]+\*/g, '').replace(/\n/g, ' ');
    void textToSpeech(clean).then(() => setIsSpeaking(false));
  };

  return (
    <Layout>
      <div className="voice-page">
        <div className="voice-header">
          <h1>Voice Legal Assistant</h1>
          <p>Hands-free back-and-forth: Lexora listens again after each answer when continuous mode is on</p>
        </div>

        <div className="voice-controls-row">
          <label className="voice-toggle">
            <input
              type="checkbox"
              checked={autoContinue}
              onChange={e => setAutoContinue(e.target.checked)}
            />
            <span>Continuous conversation (auto-listen after each reply)</span>
          </label>
          <button type="button" className="voice-clear-btn" onClick={clearConversation}>
            Clear conversation
          </button>
        </div>

        <div className="language-selector">
          <label>Select Language:</label>
          <select
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
            className="lang-select"
          >
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        <div className="mic-section">
          <div className={`mic-container ${isListening ? 'listening' : ''} ${isProcessing ? 'processing' : ''} ${isSpeaking ? 'speaking' : ''}`}>
            {isListening && (
              <>
                <div className="ripple r1" />
                <div className="ripple r2" />
                <div className="ripple r3" />
              </>
            )}
            <button
              type="button"
              className="mic-button"
              onClick={isListening || isSpeaking ? stopListening : startListening}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="mic-spinner" />
              ) : isListening ? (
                <span className="mic-icon">⏹</span>
              ) : isSpeaking ? (
                <span className="mic-icon">🔊</span>
              ) : (
                <span className="mic-icon">🎙️</span>
              )}
            </button>
          </div>

          {isListening && (
            <div className="waveform">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}

          <p className="status-text">{statusText}</p>
        </div>

        {messages.length > 0 && (
          <div className="voice-thread" aria-label="Conversation">
            <div className="voice-thread-header">This session</div>
            <div className="voice-thread-scroll">
              {messages.map(m => (
                <div
                  key={m.id}
                  className={`voice-thread-bubble ${m.role === 'user' ? 'user' : 'assistant'}`}
                >
                  <span className="voice-thread-role">{m.role === 'user' ? 'You' : 'Lexora'}</span>
                  <p>{m.content}</p>
                </div>
              ))}
              <div ref={conversationEndRef} />
            </div>
          </div>
        )}

        {transcript && (
          <div className="voice-card transcript-card">
            <div className="card-label">🎤 Latest question</div>
            <p className="card-text">{transcript}</p>
          </div>
        )}

        {response && (
          <div className="voice-card response-card">
            <div className="card-label">⚖️ Latest reply</div>
            <div className="response-text">
              {response.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <button type="button" className="speak-again-btn" onClick={speakResponseAgain}>
              🔊 Speak again
            </button>
          </div>
        )}

        <div className="voice-tips">
          <h3>💡 Tips</h3>
          <ul>
            <li>Turn on continuous conversation for a natural voice chat without tapping the mic each time</li>
            <li>Tap stop while Lexora is speaking to interrupt</li>
            <li>Ask one focused question per turn for clearer answers</li>
            <li>Use Chrome or Edge for reliable speech recognition</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default VoicePage;
