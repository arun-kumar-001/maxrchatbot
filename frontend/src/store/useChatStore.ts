export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface ChatState {
  isOpen: boolean;
  messages: Message[];
  isTyping: boolean;
  conversationId: string | null;
  toggleChat: () => void;
  setIsOpen: (open: boolean) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setIsTyping: (isTyping: boolean) => void;
  setConversationId: (id: string) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  messages: [],
  isTyping: false,
  conversationId: null,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (open) => set({ isOpen: open }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setIsTyping: (isTyping) => set({ isTyping }),
  setConversationId: (id) => set({ conversationId: id }),
  reset: () => set({ messages: [], isTyping: false, conversationId: null }),
}));