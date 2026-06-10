import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useChatStore } from "@/store/useChatStore";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001";

export function useSocket(conversationId?: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const addMessage = useChatStore((s) => s.addMessage);
  const setIsTyping = useChatStore((s) => s.setIsTyping);

  useEffect(() => {
    if (!conversationId) return;

    const socket = io(`${WS_URL}/chat`, {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", { conversationId });
    });

    socket.on("message", (data: { role: string; content: string }) => {
      addMessage({
        id: crypto.randomUUID(),
        role: data.role as "user" | "assistant",
        content: data.content,
        createdAt: new Date().toISOString(),
      });
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop_typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [conversationId, addMessage, setIsTyping]);

  const sendMessage = useCallback(
    (message: string) => {
      if (socketRef.current?.connected && conversationId) {
        socketRef.current.emit("message", { conversationId, message });
      }
    },
    [conversationId]
  );

  return { sendMessage, socket: socketRef.current };
}