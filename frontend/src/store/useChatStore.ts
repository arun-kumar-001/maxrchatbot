import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface ChatState {
  isOpen: boolean;
  messages: Message[];
  isTyping: boolean;
  toggleChat: () => void;
  setIsOpen: (open: boolean) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setIsTyping: (isTyping: boolean) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  messages: [],
  isTyping: false,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (open) => set({ isOpen: open }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setIsTyping: (isTyping) => set({ isTyping }),
  reset: () => set({ messages: [], isTyping: false }),
}));
