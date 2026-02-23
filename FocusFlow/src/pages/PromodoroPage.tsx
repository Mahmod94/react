import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import type { Task } from "../types/task";
import { usePromodoro } from "../PromodoroProvider";

type Props = {
  tasks: Task[];
};

export default function PromodoroPage({ tasks }: Props) {
  const {
    timeLeft,
    running,
    selectedTaskId,
    setSelectedTaskId,
    startPause,
    reset,
    durationSeconds,
    setDurationSeconds,
  } = usePromodoro();

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const minutesValue = Math.floor(durationSeconds / 60);

  return (
    <Box sx={{ maxWidth: 520, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 700 }}>
        Promodoro
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            {/* Settings row */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {/* Task Select (MUI istället för native select) */}
              <FormControl size="small" fullWidth>
                <InputLabel id="promodoro-task-label">Task</InputLabel>
                <Select
                  labelId="promodoro-task-label"
                  label="Task"
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(String(e.target.value))}
                >
                  <MenuItem value="">
                    <em>No task</em>
                  </MenuItem>
                  {tasks.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Minutes Select */}
              <FormControl size="small" fullWidth>
                <InputLabel id="promodoro-len-label">Minutes</InputLabel>
                <Select
                  labelId="promodoro-len-label"
                  label="Minutes"
                  value={minutesValue}
                  disabled={running}
                  onChange={(e) => {
                    const minutes = Number(e.target.value);
                    setDurationSeconds(minutes * 60);
                  }}
                >
                  {[15, 20, 25, 30, 45, 60].map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {/* Timer */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  letterSpacing: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatTime(timeLeft)}
              </Typography>
            </Box>

            {/* Actions */}
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                fullWidth
                onClick={startPause}
                sx={{ py: 1.2 }}
              >
                {running ? "Pause" : "Start"}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={reset}
                sx={{ py: 1.2 }}
              >
                Reset
              </Button>
            </Stack>

            {/* Small status text */}
            <Typography variant="body2" color="text.secondary">
              {running
                ? "Timer is running. Minutes are locked."
                : "Pick a task and duration, then start."}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}