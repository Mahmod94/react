import type { Session } from "../types/session";
import { loadSessions, saveSessions } from "../storage/sessionsStorage";

export function listSessions(): Session[] {
    return loadSessions();
}

export function addSession (session: Session): Session[] {
    const current = loadSessions();
    const next = [...current, session];
    saveSessions(next);
    return next;
}

export function clearAllSessions(): void {
    saveSessions([]);
}