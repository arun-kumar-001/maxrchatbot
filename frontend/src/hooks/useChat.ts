import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useChatStore } from "@/store/useChatStore";

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => api.get("/health").then((r) => r.data),
    retry: 3,
    retryDelay: 2000,
    staleTime: 30000,
  });
}

export function useSendMessage() {
  const addMessage = useChatStore((s) => s.addMessage);
  const setIsTyping = useChatStore((s) => s.setIsTyping);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { conversationId: string; message: string }) =>
      api.post("/chat/message", data).then((r) => r.data),
    onMutate: (variables: { conversationId: string; message: string }) => {
      setIsTyping(true);
      addMessage({
        id: crypto.randomUUID(),
        role: "user" as const,
        content: variables.message,
        createdAt: new Date().toISOString(),
      });
    },
    onSuccess: (data: { reply: string }) => {
      setIsTyping(false);
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: data.reply,
        createdAt: new Date().toISOString(),
      });
    },
    onError: () => setIsTyping(false),
  });
}

export function useConversations(status?: string) {
  return useQuery({
    queryKey: ["conversations", status],
    queryFn: () =>
      api.get("/admin/conversations", { params: status ? { status } : {} }).then((r) => r.data),
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get("/admin/dashboard").then((r) => r.data),
  });
}

export function useTakeover() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { conversationId: string; adminId: string }) =>
      api.post("/admin/takeover", data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
