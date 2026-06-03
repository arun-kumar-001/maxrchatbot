import { create } from 'zustand';
import type { WebchatMessage } from '@/lib/api';

interface ChatState {
  isOpen: boolean;
  messages: WebchatMessage[];
  isTyping: boolean;
  sessionId: string | null;
  visitorId: string | null;
  botName: string;
  isReady: boolean;
  error: string | null;
  toggleChat: () => void;
  setIsOpen: (open: boolean) => void;
  addMessage: (message: WebchatMessage) => void;
  addMessages: (messages: WebchatMessage[]) => void;
  setMessages: (messages: WebchatMessage[]) => void;
  setIsTyping: (isTyping: boolean) => void;
  setSessionId: (id: string | null) => void;
  setVisitorId: (id: string | null) => void;
  setBotName: (name: string) => void;
  setIsReady: (ready: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  messages: [],
  isTyping: false,
  sessionId: null,
  visitorId: null,
  botName: 'Assistant',
  isReady: false,
  error: null,
  toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),
  setIsOpen: (open) => set({ isOpen: open }),
  addMessage: (message) =>
    set((s) => ({ messages: [...s.messages, message], error: null })),
  addMessages: (messages) =>
    set((s) => ({ messages: [...s.messages, ...messages], error: null })),
  setMessages: (messages) => set({ messages }),
  setIsTyping: (isTyping) => set({ isTyping }),
  setSessionId: (sessionId) => set({ sessionId }),
  setVisitorId: (visitorId) => set({ visitorId }),
  setBotName: (botName) => set({ botName }),
  setIsReady: (isReady) => set({ isReady }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      messages: [],
      isTyping: false,
      sessionId: null,
      isReady: false,
      error: null,
    }),
}));
