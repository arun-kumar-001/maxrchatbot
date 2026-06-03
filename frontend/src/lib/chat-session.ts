const VISITOR_KEY = 'maxr_visitor_id';
const SESSION_KEY = 'maxr_session_id';

export function getVisitorId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(VISITOR_KEY);
}

export function setVisitorId(id: string) {
  localStorage.setItem(VISITOR_KEY, id);
}

export function getStoredSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setStoredSessionId(id: string) {
  localStorage.setItem(SESSION_KEY, id);
}

export function clearChatSession() {
  localStorage.removeItem(SESSION_KEY);
}
