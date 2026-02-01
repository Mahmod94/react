export type TaskStatus = "todo" | "doing" | "done";

export type Task = {
    id: number;
    title: string;
    status: TaskStatus;
};