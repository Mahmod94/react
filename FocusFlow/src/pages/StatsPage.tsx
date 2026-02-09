import type { Session } from "../types/session";
import { usePromodoro } from "../PromodoroProvider";
import { Typography } from "@mui/material";

const formatHM = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export default function StatsPage() {
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

  return (
    <div>
      <Typography variant="h4" component="h2" sx={{ color: "#C45AB3" }}>Stats</Typography>
      <Typography variant="body1"> 
        Sessions: {totalSessions}
      </Typography>
      <Typography variant="body1">
        Total foccus: {formatHM(totalFocusSeconds)}
      </Typography>
      <p>Total focus: {formatHM(totalFocusSeconds)}</p>
      <p>Focus today: {formatHM(focusTodaySeconds)}</p>
    </div>
  );
}
