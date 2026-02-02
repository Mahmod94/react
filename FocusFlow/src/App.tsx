import { useEffect, useState } from "react";
import type { Session } from "./types/session.ts";

import StatsPage from "./pages/StatsPage"
import PromodoroPage from "./pages/PromodoroPage";
import TasksPage from "./pages/TasksPage";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar.tsx";

const SESSIONS_KEY = "focusflow.sessions";

export default function App()
{
  const[sessions, setSessions] = useState<Session[]>(() => {
    try {
      const raw = localStorage.getItem(SESSIONS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Session[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }, [sessions]);

  return(
    <>
      <div>
        <h1>FocusFlow</h1>

        <NavBar />
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/promodoropage" element={<PromodoroPage sessions={sessions} setSessions={setSessions} />} />
          <Route path="/statspage" element={<StatsPage sessions={sessions}/>} />
  
        </Routes>
      </div>
    </>
  );
}
