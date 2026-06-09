import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: () => api.get("/services").then((r) => r.data),
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics", "stats"],
    queryFn: () => api.get("/analytics/stats").then((r) => r.data),
  });
}