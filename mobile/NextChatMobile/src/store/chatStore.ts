import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { MessageStorage } from '../utils/performance';

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  date: string;
  model?: string;
}

export interface ChatSession {
  id: string;
  topic: string;
  messages: ChatMessage[];
  lastUpdate: number;
}

interface ChatStoreState {
  sessions: ChatSession[];
  currentSessionIndex: number;
  apiKey: string;
  secretKey: string; // For Baidu ERNIE models
  selectedModel: string;
  
  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'date'>) => void;
  createSession: () => void;
  switchSession: (index: number) => void;
  deleteSession: (index: number) => void;
  setApiKey: (key: string) => void;
  setSecretKey: (key: string) => void; // For Baidu ERNIE models
  setSelectedModel: (model: string) => void;
  initializeStore: () => Promise<void>;
  saveStore: () => Promise<void>;
}

const createEmptySession = (): ChatSession => {
  return {
    id: nanoid(),
    topic: 'New Chat',
    messages: [],
    lastUpdate: Date.now(),
  };
};

export const useChatStore = create<ChatStoreState>((set, get) => ({
  sessions: [createEmptySession()],
  currentSessionIndex: 0,
  apiKey: '',
  secretKey: '', // For Baidu ERNIE models
  selectedModel: 'gpt-4',
  
  addMessage: (message) => set((state) => {
    const sessions = [...state.sessions];
    const currentSession = sessions[state.currentSessionIndex];
    
    sessions[state.currentSessionIndex] = {
      ...currentSession,
      messages: [
        ...currentSession.messages,
        {
          ...message,
          id: nanoid(),
          date: new Date().toLocaleString(),
        }
      ],
      lastUpdate: Date.now(),
    };
    
    // Save to storage
    MessageStorage.saveMessages(sessions);
    
    return { sessions };
  }),
  
  createSession: () => set((state) => {
    const newSession = createEmptySession();
    const sessions = [...state.sessions, newSession];
    const currentSessionIndex = sessions.length - 1;
    
    // Save to storage
    MessageStorage.saveMessages(sessions);
    
    return {
      sessions,
      currentSessionIndex,
    };
  }),
  
  switchSession: (index) => set({ currentSessionIndex: index }),
  
  deleteSession: (index) => set((state) => {
    const sessions = [...state.sessions];
    sessions.splice(index, 1);
    
    const currentSessionIndex = 
      index === 0 
        ? 0 
        : index >= sessions.length 
          ? sessions.length - 1 
          : index;
    
    // Save to storage
    MessageStorage.saveMessages(sessions);
    
    return {
      sessions,
      currentSessionIndex,
    };
  }),
  
  setApiKey: (key) => set({ apiKey: key }),
  
  setSecretKey: (key) => set({ secretKey: key }), // For Baidu ERNIE models
  
  setSelectedModel: (model) => set({ selectedModel: model }),
  
  initializeStore: async () => {
    try {
      const savedSessions = await MessageStorage.loadMessages();
      if (savedSessions) {
        set({ sessions: savedSessions });
      }
    } catch (error) {
      console.error('Failed to initialize store:', error);
    }
  },
  
  saveStore: async () => {
    try {
      const { sessions } = get();
      await MessageStorage.saveMessages(sessions);
    } catch (error) {
      console.error('Failed to save store:', error);
    }
  },
}));