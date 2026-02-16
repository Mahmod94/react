import { Button, Typography, FormControl, InputLabel, Select, MenuItem, duration, Menu  } from "@mui/material";
import type { Task } from "../types/task";
import { usePromodoro } from "../PromodoroProvider";

type Props = {
    tasks: Task[];
}

export default function PromodoroPage({ tasks } : Props)
{

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

    return (
        <div>
            <Typography variant="h4" component="h2" sx={{ color : "#C45AB3"}}>Promodoro</Typography>
            
            {/* Väj task */}
            <select value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)}>
                <option value="">No task</option>
                {tasks.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                ))}
            </select>

            {/* Välj tid */}
            <FormControl size="small" sx={{ mt: 2, minWidth: 160}}>
                <InputLabel id="promodoro-len-label">Minutes</InputLabel>
                <Select
                    labelId="promodoro-len-label"
                    label="Minutes"
                    value={Math.floor(durationSeconds / 60 )}
                    disabled={running}
                    onChange={(e) => {
                        const minutes = Number(e.target.value);
                        setDurationSeconds(minutes * 60);
                    }}
                >
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={45}>45</MenuItem>
                    <MenuItem value={60}>60</MenuItem>
                </Select>
            </FormControl>

            <div style={{ fontSize: "2rem", marginBottom:"1rem"}}>
                {formatTime(timeLeft)}
            </div>

            <Button onClick={startPause}>{running ? "Pause" : "Start"}</Button>
            <Button onClick={reset}>Reset</Button>
        </div>
    );

}

