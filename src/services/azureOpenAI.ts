const AZURE_ENDPOINT = 'https://genai-trigent-openai.openai.azure.com/';
const AZURE_API_KEY = '51ba5d46601c477b844d3883af93463c';
const DEPLOYMENT_NAME = 'gpt-4o-mini';
const API_VERSION = '2024-02-15-preview';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are Lexora, an AI legal assistant specialized in Indian law. You provide helpful, accurate information about:
- Indian Penal Code (IPC), CrPC, CPC
- Family Law (Hindu Marriage Act, Muslim Personal Law, Special Marriage Act)
- Property Law, Contract Law, Labour Law
- Constitutional Law, Consumer Protection
- Corporate Law, GST, Business Regulations

Always:
1. Be professional and empathetic
2. Cite relevant acts and sections when applicable
3. Add disclaimer: "*Disclaimer: This is general legal information for educational purposes only and does not constitute professional legal advice.*"
4. Recommend consulting a qualified lawyer for specific legal matters
5. Respond in clear, simple language

You are integrated into the Lexora platform used by legal professionals and citizens of India.`;

export async function sendChatMessage(messages: Message[], userMessage: string): Promise<string> {
  const url = `${AZURE_ENDPOINT}openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`;

  const chatMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage }
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': AZURE_API_KEY,
    },
    body: JSON.stringify({
      messages: chatMessages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Azure API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  // Azure OpenAI Whisper endpoint
  const url = `${AZURE_ENDPOINT}openai/deployments/whisper/audio/transcriptions?api-version=${API_VERSION}`;
  
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'api-key': AZURE_API_KEY },
      body: formData,
    });

    if (!response.ok) throw new Error('Transcription failed');
    const data = await response.json();
    return data.text;
  } catch {
    // Fallback: use Web Speech API
    return '';
  }
}

export async function textToSpeech(text: string): Promise<void> {
  // Use browser's built-in TTS
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text.replace(/\*[^*]+\*/g, ''));
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}
