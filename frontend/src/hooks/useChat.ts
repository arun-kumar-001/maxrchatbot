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

  return useMutation({
    mutationFn: ({
      conversationId,
      message,
    }: {
      conversationId: string;
      message: string;
    }) =>
      api
        .post("/chat/message", { conversationId, message })
        .then((r) => r.data),
    onMutate: async ({ message }) => {
      setIsTyping(true);
      addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: message,
        createdAt: new Date().toISOString(),
      });
    },
    onSuccess: (data) => {
      setIsTyping(false);
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
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
      api
        .get("/admin/conversations", { params: status ? { status } : {} })
        .then((r) => r.data),
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