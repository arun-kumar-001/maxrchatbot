import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post("/auth/login", data).then((r) => r.data),
    onSuccess: (data: { user: any; accessToken: string }) => {
      setAuth(data.user, data.accessToken);
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (data: { email: string; password: string; name?: string }) =>
      api.post("/auth/register", data).then((r) => r.data),
    onSuccess: (data: { user: any; accessToken: string }) => {
      setAuth(data.user, data.accessToken);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  return () => logout();
}
