import { useEffect, useRef, useState } from "react";


import type { Task } from "../types/task";
import type { Session } from "../types/session";

const PROMODORO_LENGTH = 10;

// const STORAGE_KEY = "focusflow.sessions";

type Props = {
    sessions: Session[];
    setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
    tasks: Task[];

}

export default function PromodoroPage({ sessions, setSessions, tasks } : Props)
{
    const [timeLeft, setTimeLeft] = useState<number>(PROMODORO_LENGTH);
    const [running, setIsRunning] = useState<boolean>(false);

    const [selectedTaskId, setSelectedTaskId] = useState<string | "">("");

    // const [sessions, setSession] = useState<Session[]>(() => {
    //     try {
    //         const raw = localStorage.getItem(STORAGE_KEY);
    //         console.log("LOADED RAW:", raw);
    //         if (!raw) return [];
    //         const parsed = JSON.parse(raw);
    //         return Array.isArray(parsed) ? (parsed as Session []) : [];
    //     } catch (err) {
    //         console.error("Failed to load sessions:", err);
    //         return [];
    //     }
    // });

    // Hjälpfunktion för mm:ss
    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds/ 60);
        const s = totalSeconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };


    // useEffect(() => {
    //     // localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    //     console.log("SAVED", sessions);
    // }, [sessions]);

    useEffect(() => {
        if(!running) return;

        const id = window.setInterval(() => {
            setTimeLeft(prev => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(id);
    }, [running]);

    const loggedRef = useRef(false);

    useEffect(() => {
        if (!running) return;

        if (timeLeft === 0 && !loggedRef.current){
            loggedRef.current = true;

            setIsRunning(false);
            setSessions(prev => [
                ...prev,
                {
                    id: Date.now(),
                    durationSeconds: PROMODORO_LENGTH,
                    endedAt: Date.now(),
                    type: "focus",
                    taskId: selectedTaskId || undefined,
                },
            ]);
        }
    }, [timeLeft, running, setSessions])


    const handleStartPause = () => {
        if (!running) loggedRef.current = false;
        setIsRunning(p => !p);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(PROMODORO_LENGTH);
        loggedRef.current= false;
    };
    return (
        <div>
            <h1>Promodoro</h1>
            <select value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)}>
                <option value="">No task</option>
                {tasks.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                ))}
            </select>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                {formatTime(timeLeft)}
            </div>

            <button onClick={handleStartPause}>
                {running ? "Pause" : "Start"}
            </button>

            <button onClick={handleReset} style={{ marginLeft: "0.5rem" }}>
                Reset
            </button>
        <ul>
            {sessions.map((s)=>(
                <li key={s.id}>
                    {s.type} — {formatTime(s.durationSeconds)} —{" "}
                    {new Date(s.endedAt).toLocaleString()}
                </li>
            ))}
        </ul>
        </div>
    );

}

