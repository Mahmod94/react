import type { Session } from "../types/session";

const SESSIONS_KEY = "foxusflow.sessions";

export function loadSessions(): Session[] {
    try {
        const raw = localStorage.getItem(SESSIONS_KEY);
        if (!raw) return[];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as Session[]) : [];
    } catch {
        return [];
    }
}

export function saveSessions(sessions: Session[]) {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}