/**
 * Author: Mahmod
 * Purpose: self development in frontend
 */

import React, { createContext, useContext, useEffect, useRef, useState} from "react";
import type { Session } from "./types/session";

import { listSessions, addSession as repoAddSession, clearAllSessions } from "./data/sessionsRepo";


const DEFAULT_PROMODORO_SECONDS = 25 * 60 ;

type PromodoroState = {
  timeLeft: number;
  running: boolean;
  
  durationSeconds: number;
  setDurationSeconds: (seconds: number) => void;

  selectedTaskId: string;
  setSelectedTaskId: (id: string) => void;

  sessions: Session[];
  addSession: (s: Session) => void;
  clearSessions: () => void;

  startPause: () => void;
  reset: () => void;
};

const PromodoroContext = createContext<PromodoroState | null>(null);



export function PromodoroProvider({ children }: { children: React.ReactNode }) {

  const [sessions, setSessions] = useState<Session[]>(() => listSessions());

  const [durationSeconds, setDurationSecondsState] = useState<number>(DEFAULT_PROMODORO_SECONDS);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_PROMODORO_SECONDS);

  const [running, setRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const loggedRef = useRef(false);

  useEffect(() => {
    if (!running) return;

    const id = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(id);
  }, [running]);

  const addSession = (s: Session) => {
    const next = repoAddSession(s);
    setSessions(next);
  };

  const clearSessions = () => {
    clearAllSessions();
    setSessions([]);
  };

  useEffect(() => {
    if (!running) return;

    if (timeLeft === 0 && !loggedRef.current) {
      loggedRef.current = true;
      setRunning(false);

      addSession({
        id: Date.now(),
        durationSeconds: durationSeconds,
        endedAt: Date.now(),
        type: "focus",
        taskId: selectedTaskId || undefined,
      });
      setTimeLeft(durationSeconds);
    }
  }, [timeLeft, running, selectedTaskId, durationSeconds]);

  const startPause = () => {
    if (!running) loggedRef.current = false;
    setRunning((p) => !p);
  };

  const reset = () => {
    setRunning(false);
    setTimeLeft(durationSeconds);
    loggedRef.current = false;
  };

  // setter som inte låter user ändra mitt i körning (enkel och tydlig)
  const setDurationSeconds = (seconds: number) => {
    if (running) return;
    const safe = Math.max (1 * 60, Math.min(seconds, 120 * 60)); // 1 - 120 min
    
    setDurationSecondsState(safe); // uppdatera display direkt när inte running
    setTimeLeft(safe);
    loggedRef.current = false;
  };

  return (
    <PromodoroContext.Provider
      value={{
        timeLeft,
        running,
        durationSeconds,
        setDurationSeconds,
        selectedTaskId,
        setSelectedTaskId,
        sessions,
        addSession,
        clearSessions,
        startPause,
        reset,
      }}
      >
        {children}
      </PromodoroContext.Provider>
  );
}

export function usePromodoro(){
  const ctx = useContext(PromodoroContext);
  if (!ctx) throw new Error("usePromodoro must be used within PromodoroProvider");
  return ctx;
}
