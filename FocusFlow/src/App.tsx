import type { Task } from "./types/task";
import { useEffect, useState } from "react";
import { PromodoroProvider } from "./PromodoroProvider";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import TasksPage from "./pages/TasksPage";
import PromodoroPage from "./pages/PromodoroPage";
import StatsPage from "./pages/StatsPage";
import { Toolbar, Typography, Box } from "@mui/material";


const Storage_Key = "focusfolw.tasks";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(Storage_Key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Task[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(Storage_Key, JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div>
      <NavBar />
      <Toolbar />

      <Box textAlign="center" mt={2} mb={3}>
        <Typography variant="h3" component="h1" color="secondary">
          Focus Flow
        </Typography>
      </Box>
      <PromodoroProvider>
        <Routes>
          <Route path="/" element={<TasksPage tasks={tasks} setTasks={setTasks} />} />
          <Route path="/promodoropage" element={<PromodoroPage tasks={tasks} />} />
          <Route path="/statspage" element={<StatsPage />} />
        </Routes>
      </PromodoroProvider>
    </div>
  );
}