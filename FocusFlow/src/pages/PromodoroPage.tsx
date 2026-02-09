import { Button, Typography } from "@mui/material";
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
    } = usePromodoro();


    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div>
            <Typography variant="h4" component="h2" sx={{ color : "#C45AB3"}}>Promodoro</Typography>

            <select value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)}>
                <option value="">No task</option>
                {tasks.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                ))}
            </select>

            <div style={{ fontSize: "2rem", marginBottom:"1rem"}}>
                {formatTime(timeLeft)}
            </div>

            <Button onClick={startPause}>{running ? "Pause" : "Start"}</Button>
            <Button onClick={reset}>Reset</Button>
        </div>
    );

}

