import { useEffect, useState } from "react";

import type { Task } from "./types/task.ts";
import type { Session } from "./types/session.ts";

import { PromodoroProvider } from "./PromodoroProvider.tsx";
import StatsPage from "./pages/StatsPage"
import PromodoroPage from "./pages/PromodoroPage";
import TasksPage from "./pages/TasksPage";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar.tsx";

const SESSIONS_KEY = "focusflow.sessions";

const STORAGE_KEY = "focusflow.tasks";

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

  const [tasks, setTasks] = useState<Task[]>(() => {
    try
    {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Task[]) : [];
    }catch {
      return [];
    }
  });

  useEffect(() =>{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks])

  return(
    <>
      <div>
        <h1>FocusFlow</h1>

        <NavBar />
        <PromodoroProvider setSessions={setSessions}>
        <Routes>
          <Route path="/" element={<TasksPage tasks={tasks} setTasks={setTasks} />} />
          <Route path="/promodoropage" element={<PromodoroPage sessions={sessions} setSessions={setSessions} tasks={tasks} />} />
          <Route path="/statspage" element={<StatsPage sessions={sessions}/>} />  
        </Routes>
        </PromodoroProvider>
      </div>
    </>
  );
}
