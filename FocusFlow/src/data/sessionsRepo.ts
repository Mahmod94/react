import type { Session } from "../types/session";
import { loadSessions, saveSessions } from "../storage/sessionsStorage";

export function createSession(session: Session): Session[] {
    const sessions = loadSessions();
    const next = [...sessions, session];
    saveSessions(next);
    return next;
}

export function clearSessions(): void {
    saveSessions([]);
}