// /**
//  * Author: Mahmod
//  * Purpose: self development in frontend
//  */

// import React, { createContext, useContext, useEffect, useRef, useState} from "react";
// import type { Session } from "./types/session";

// import { listSessions, addSession as repoAddSession, clearAllSessions } from "./data/sessionsRepo";


// const DEFAULT_FOCUS_SECONDS = 25 * 60 ;
// const DEFAULT_BREAK_SECONDS = 5 * 60;

// type Mode = "focus" | "break";

// type PromodoroState = {
//   timeLeft: number;
//   running: boolean;

//   mode: Mode;
  
//   durationSeconds: number;
//   setDurationSeconds: (seconds: number) => void;

//   selectedTaskId: string;
//   setSelectedTaskId: (id: string) => void;

//   sessions: Session[];
//   addSession: (s: Session) => void;
//   clearSessions: () => void;

//   startPause: () => void;
//   reset: () => void;

//   // later: skip()
// };

// const PromodoroContext = createContext<PromodoroState | null>(null);



// export function PromodoroProvider({ children }: { children: React.ReactNode }) {

//   const [sessions, setSessions] = useState<Session[]>(() => listSessions());

//   const [focusSeconds, setFocusSecondsState] = useState<number>(DEFAULT_FOCUS_SECONDS);
//   const [breakSeconds, setBreakSecondsState] = useState<number>(DEFAULT_BREAK_SECONDS);

//   const [mode, setMode] = useState<Mode>("focus");

//   const [durationSeconds, setDurationSecondsState] = useState<number>(DEFAULT_FOCUS_SECONDS);
//   const [timeLeft, setTimeLeft] = useState(DEFAULT_FOCUS_SECONDS);

//   const [running, setRunning] = useState(false);
//   const [selectedTaskId, setSelectedTaskId] = useState("");

//   const loggedRef = useRef(false);

//   useEffect(() => {
//     if (!running) return;

//     const id = window.setInterval(() => {
//       setTimeLeft((prev) => Math.max(prev - 1, 0));
//     }, 1000);

//     return () => window.clearInterval(id);
//   }, [running]);

//   const addSession = (s: Session) => {
//     const next = repoAddSession(s);
//     setSessions(next);
//   };

//   const clearSessions = () => {
//     clearAllSessions();
//     setSessions([]);
//   };

//   const currentDuration = mode === "focus" ? focusSeconds : breakSeconds;

//   // När timern når 0 --> växla mode
//   useEffect(() => {
//     if (!running) return;

//     if (timeLeft === 0 && !loggedRef.current) {
//       loggedRef.current = true;
//       setRunning(false);

//     if (mode === "focus")
//     {
//       // logga endast focus
//       addSession({
//         id: Date.now(),
//         durationSeconds: focusSeconds,
//         endedAt: Date.now(),
//         type: "focus",
//         taskId: selectedTaskId || undefined,
//       });
//     // byt till break
//     setMode("break");
//     setTimeLeft(breakSeconds);
//     } else {
//       // break klart --> tillbaka till focus
//       setMode("break");
//       setTimeLeft(breakSeconds);
//     }
//     }
//   }, [timeLeft, running, mode, focusSeconds, breakSeconds, selectedTaskId]);

//   const startPause = () => {
//     if (!running) loggedRef.current = false;
//     setRunning((p) => !p);
//   };

//   const reset = () => {
//     setRunning(false);
//     loggedRef.current = false;
//     setMode("focus");
//     setTimeLeft(durationSeconds);
//   };

//   const skip = () => {
//     // hoppa direkt till nästa läge
//     setRunning(false);
//     loggedRef.current = false;

//     if (mode === "focus") {
//       setMode("break");
//       setTimeLeft(breakSeconds);
//     } else {
//       setMode("focus");
//       setTimeLeft(focusSeconds);
//     }
//   };

//   // setter som inte låter user ändra mitt i körning (enkel och tydlig)
//   const setDurationSeconds = (seconds: number) => {
//     if (running) return;
//     const safe = Math.max (1 * 60, Math.min(seconds, 120 * 60)); // 1 - 120 min
    
//     setDurationSecondsState(safe); // uppdatera display direkt när inte running
//     setTimeLeft(safe);
//     loggedRef.current = false;
//   };

//   return (
//     <PromodoroContext.Provider
//       value={{
//         timeLeft,
//         running,
//         durationSeconds,
//         setDurationSeconds,
//         selectedTaskId,
//         setSelectedTaskId,
//         sessions,
//         addSession,
//         clearSessions,
//         startPause,
//         reset,
//       }}
//       >
//         {children}
//       </PromodoroContext.Provider>
//   );
// }

// export function usePromodoro(){
//   const ctx = useContext(PromodoroContext);
//   if (!ctx) throw new Error("usePromodoro must be used within PromodoroProvider");
//   return ctx;
// }
/**
 * Author: Mahmod
 * Purpose: self development in frontend
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Session } from "./types/session";
import {
  listSessions,
  addSession as repoAddSession,
  clearAllSessions,
} from "./data/sessionsRepo";

const DEFAULT_FOCUS_SECONDS = 25 * 60;
const DEFAULT_BREAK_SECONDS = 5 * 60;

type Mode = "focus" | "break";

type PromodoroState = {
  timeLeft: number;
  running: boolean;
  mode: Mode;

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

export function PromodoroProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessions, setSessions] = useState<Session[]>(() =>
    listSessions()
  );

  const breakSeconds = DEFAULT_BREAK_SECONDS;

  const [mode, setMode] = useState<Mode>("focus");
  const [durationSeconds, setDurationSecondsState] =
    useState<number>(DEFAULT_FOCUS_SECONDS);

  const [timeLeft, setTimeLeft] = useState(DEFAULT_FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const loggedRef = useRef(false);

  // Ticking timer
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

  // När timern når 0 → växla läge
  useEffect(() => {
    if (!running) return;
    if (timeLeft !== 0) return;
    if (loggedRef.current) return;

    loggedRef.current = true;
    setRunning(false);

    const endedAt = Date.now();

    if (mode === "focus") {
      // Logga focus-session
      addSession({
        id: endedAt,
        durationSeconds: durationSeconds,
        endedAt,
        type: "focus",
        taskId: selectedTaskId || undefined,
      });

      // Växla till break
      setMode("break");
      setTimeLeft(breakSeconds);
    } else {
      // Break klar → tillbaka till focus
      setMode("focus");
      setTimeLeft(durationSeconds);
    }
  }, [
    timeLeft,
    running,
    mode,
    durationSeconds,
    breakSeconds,
    selectedTaskId,
  ]);

  const startPause = () => {
    if (!running) loggedRef.current = false;
    setRunning((prev) => !prev);
  };

  const reset = () => {
    setRunning(false);
    loggedRef.current = false;
    setMode("focus");
    setTimeLeft(durationSeconds);
  };

  const setDurationSeconds = (seconds: number) => {
    if (running) return;

    const safe = Math.max(
      1 * 60,
      Math.min(seconds, 120 * 60)
    );

    setDurationSecondsState(safe);
    setTimeLeft(safe);
    loggedRef.current = false;
  };

  return (
    <PromodoroContext.Provider
      value={{
        timeLeft,
        running,
        mode,
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

export function usePromodoro() {
  const ctx = useContext(PromodoroContext);
  if (!ctx)
    throw new Error(
      "usePromodoro must be used within PromodoroProvider"
    );
  return ctx;
}