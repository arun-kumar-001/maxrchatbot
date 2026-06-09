import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: () => api.get("/leads").then((r) => r.data),
  });
}

export function useLeadsStats() {
  return useQuery({
    queryKey: ["leads", "stats"],
    queryFn: () => api.get("/analytics/stats").then((r) => r.data),
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; status?: string; notes?: string }) =>
      api.put(`/leads/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });
}