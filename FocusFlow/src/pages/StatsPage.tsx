import { useMemo } from "react";
import { usePromodoro } from "../PromodoroProvider";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import type { Task } from "../types/task";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

type Props = { tasks: Task[] };

const toMinutes = (seconds: number) => Math.round(seconds / 60);

const dayKey = (ms: number) => {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  // YYYY-MM-DD
  return d.toISOString().slice(0, 10);
};

export default function StatsPage({ tasks }: Props) {
  const { sessions } = usePromodoro();

  const titleById = useMemo(() => new Map(tasks.map(t => [t.id, t.title])), [tasks]);

  // 1) Top tasks (focus only)
  const topTasksData = useMemo(() => {
    const map = new Map<string, number>(); // taskId -> focusSeconds
    for (const s of sessions) {
      if (s.type !== "focus") continue;
      if (!s.taskId) continue;
      map.set(s.taskId, (map.get(s.taskId) ?? 0) + s.durationSeconds);
    }

    const rows = Array.from(map.entries()).map(([taskId, seconds]) => ({
      taskId,
      title: titleById.get(taskId) ?? "(deleted task)",
      minutes: toMinutes(seconds),
    }));

    rows.sort((a, b) => b.minutes - a.minutes);
    return rows.slice(0, 5);
  }, [sessions, titleById]);

  const focusLast7Days = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const todayMs = now.getTime();

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(todayMs - (6 - i) * 24 * 3600 * 1000);
      return dayKey(d.getTime());
    });

    const focusByDay = new Map<string, number>();
    for (const s of sessions) {
      if (s.type !== "focus") continue;
      const k = dayKey(s.endedAt);
      focusByDay.set(k, (focusByDay.get(k) ?? 0) + s.durationSeconds);
    }

    return days.map((k) => ({
      day: k.slice(5),
      minutes: toMinutes(focusByDay.get(k) ?? 0),
    }));
  }, [sessions]);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Stats
      </Typography>

      <Stack spacing={2}>
        {/* Trend */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Focus last 7 days (minutes)
            </Typography>
            <Box sx={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={focusLast7Days}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="minutes" dot />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Top tasks (minutes)
            </Typography>

            {topTasksData.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No task-linked focus yet.
              </Typography>
            ) : (
              <Box sx={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={topTasksData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" hide /> 
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="minutes" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            <Divider sx={{ my: 1.5 }} />
            <Typography variant="body2" color="text.secondary">
              Tips: hovera på staplar/linjen för exakta värden.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}