import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Session } from "./types/session";

const POMODORO_LENGTH_SECONDS = 25 * 60;

type PromodoroState = {
  timeLeft: number;
  running: boolean;
  selectedTaskId: string;
  setSelectedTaskId: (id: string) => void;
  startPause: () => void;
  reset: () => void;
};

const PromodoroContext = createContext<PromodoroState | null>(null);

export function PromodoroProvider({
  children,
  setSessions,
}: {
  children: React.ReactNode;
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
}) {
  const [timeLeft, setTimeLeft] = useState(POMODORO_LENGTH_SECONDS);
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

  useEffect(() => {
    if (!running) return;

    if (timeLeft === 0 && !loggedRef.current) {
      loggedRef.current = true;
      setRunning(false);

      setSessions((prev) => [
        ...prev,
        {
          id: Date.now(),
          durationSeconds: POMODORO_LENGTH_SECONDS,
          endedAt: Date.now(),
          type: "focus",
          taskId: selectedTaskId || undefined,
        },
      ]);
    }
  }, [timeLeft, running, selectedTaskId, setSessions]);

  const startPause = () => {
    if (!running) loggedRef.current = false;
    setRunning((p) => !p);
  };

  const reset = () => {
    setRunning(false);
    setTimeLeft(POMODORO_LENGTH_SECONDS);
    loggedRef.current = false;
  };

  return (
    <PromodoroContext.Provider
      value={{
        timeLeft,
        running,
        selectedTaskId,
        setSelectedTaskId,
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
  if (!ctx) throw new Error("usePromodoro must be used within PromodoroProvider");
  return ctx;
}
