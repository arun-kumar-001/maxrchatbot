import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useKnowledgeArticles() {
  return useQuery({
    queryKey: ["knowledge"],
    queryFn: () => api.get("/knowledge").then((r) => r.data),
  });
}

export function useKnowledgeSearch(query: string) {
  return useQuery({
    queryKey: ["knowledge", "search", query],
    queryFn: () => api.get("/knowledge/search", { params: { q: query } }).then((r) => r.data),
    enabled: query.length > 0,
  });
}

export function useUploadKnowledge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; content: string; sourceType?: string }) =>
      api.post("/knowledge/upload", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["knowledge"] }),
  });
}

export function useReindexKnowledge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/knowledge/reindex").then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["knowledge"] }),
  });
}