import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { AxiosError } from "axios";

export function useBots() {
  return useQuery({
    queryKey: ["bots"],
    queryFn: () => api.get("/bots").then((r) => r.data),
    retry: (failureCount, err) => {
      const axiosErr = err as AxiosError;
      if (axiosErr?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

export function useCreateBot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      api.post("/bots", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bots"] }),
  });
}

export function useWorkflows() {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: () => api.get("/workflows").then((r) => r.data),
    retry: (failureCount, err) => {
      const axiosErr = err as AxiosError;
      if (axiosErr?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

export function useIntegrations() {
  return useQuery({
    queryKey: ["integrations"],
    queryFn: () => api.get("/integrations").then((r) => r.data),
    retry: (failureCount, err) => {
      const axiosErr = err as AxiosError;
      if (axiosErr?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}