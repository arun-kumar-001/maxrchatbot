"use client";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { useSendMessage } from "@/hooks/useChat";
import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export default function ChatWidget() {
  const { isOpen, messages, isTyping, toggleChat, conversationId } = useChatStore();
  const [inputValue, setInputValue] = useState("");
  const sendMessage = useSendMessage();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    const convId = conversationId || crypto.randomUUID();
    sendMessage.mutate({ conversationId: convId, message: inputValue.trim() });
    setInputValue("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-[380px] h-[600px] bg-background border rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">MAXR Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs opacity-80">Online</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10 text-primary-foreground" onClick={toggleChat}>
                <X size={20} />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="flex flex-col gap-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <Bot size={40} className="mb-2 opacity-20" />
                    <p>Hello! How can we help you today?</p>
                  </div>
                )}
                {messages.map((message: ChatMessage) => (
                  <div key={message.id} className={cn("flex max-w-[80%] flex-col gap-1", message.role === 'user' ? "ml-auto items-end" : "mr-auto items-start")}>
                    <div className={cn("rounded-2xl px-4 py-2 text-sm", message.role === 'user' ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted text-foreground rounded-tl-none")}>
                      {message.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Bot size={16} />
                    </div>
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-xs">Typing...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2 items-center">
              <Input placeholder="Type a message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="flex-1" />
              <Button type="submit" size="icon" disabled={!inputValue.trim() || isTyping}>
                <Send size={18} />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
}
