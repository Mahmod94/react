export type Session = {
    id: number;
    durationSeconds: number;
    endedAt: number;
    type: "focus" | "break";
    taskId?: number;
};