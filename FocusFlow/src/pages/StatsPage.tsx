import { usePromodoro } from "../PromodoroProvider";
import { Typography } from "@mui/material";
import { useMemo } from "react";
import type { Task } from "../types/task.ts";

type Props = {
    tasks: Task[];
}

const formatHM = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export default function StatsPage({ tasks }: Props) {
  const { sessions } = usePromodoro();

  const totalSessions = sessions.length;

  const totalFocusSeconds = sessions.reduce((sum, s) => {
    return s.type === "focus" ? sum + s.durationSeconds : sum;
  }, 0);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTodayMs = startOfToday.getTime();

  const focusTodaySeconds = sessions.reduce((sum, s) => {
    const isToday = s.endedAt >= startOfTodayMs;
    const isFocus = s.type === "focus";
    return isToday && isFocus ? sum + s.durationSeconds : sum;
  }, 0);

  // Map taskId -> title (snabb lookup)
  const titleById = useMemo(() => {
    return new Map(tasks.map((t) => [t.id, t.title]));
  }, [tasks])

  // Focus per task (bara sessions som har taskId)
  const focusByTask = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sessions) {
        if (s.type !== "focus") continue;
        if (!s.taskId) continue;
        map.set(s.taskId, (map.get(s.taskId) ?? 0) + s.durationSeconds);
    }
    return map;
  }, [sessions]);

  // Gör en sorterad lista (top 5)
  const topTasks = useMemo(() => {
    const rows = Array.from(focusByTask.entries()).map(([taskId, seconds]) => ({
        taskId,
        title: titleById.get(taskId) ?? "(deleted task)",
        seconds,
    }));

    rows.sort((a, b) => b.seconds - a.seconds);
    return rows.slice(0, 5);
  }, [focusByTask, titleById]);

  const unassignedFocusSeconds = sessions.reduce((sum, s) => {
    if (s.type !== "focus") return sum;
    if (s.taskId) return sum;
    return sum + s.durationSeconds;
  }, 0);



  return (
    <div>
      <Typography variant="h4" component="h2" sx={{ color: "#C45AB3" }}>Stats</Typography>
      <Typography variant="body1"> 
        Sessions: {totalSessions}
      </Typography>
      <hr />
      <Typography variant="body1">
        Total focus: {formatHM(totalFocusSeconds)}
      </Typography>
       <hr />
       <Typography variant="body1">
            Focus Today: {formatHM(focusTodaySeconds)}
        </Typography> 
        <hr />

        <Typography variant="h6" sx={{ mt: 3 }}>
  Top tasks
</Typography>

{topTasks.length === 0 ? (
  <Typography variant="body2">No task-linked focus yet.</Typography>
) : (
  <ol>
    {topTasks.map(t => (
      <li key={t.taskId}>
        {t.title} — {formatHM(t.seconds)}
      </li>
    ))}
  </ol>
)}

    </div>
  );
}
