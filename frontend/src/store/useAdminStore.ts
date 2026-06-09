import { create } from "zustand";

interface AdminState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  inboxFilter: "all" | "active" | "waiting" | "escalated" | "resolved";
  setInboxFilter: (f: AdminState["inboxFilter"]) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  activeConversationId: null,
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  inboxFilter: "all",
  setInboxFilter: (f) => set({ inboxFilter: f }),
}));