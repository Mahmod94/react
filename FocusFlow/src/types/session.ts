export type SessionType = "focus" | "break";

export type Session = {
    id: number;
    durationSeconds: number;
    endedAt: number;
    type: SessionType;
    taskId?: string;
};
