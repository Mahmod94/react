import type { Task } from "../types/task";
import { loadTasks, saveTasks } from "../storage/tasksStorage";

export function listTasks(): Task[] {
    return loadTasks();
}

export function createTask(title: string): Task {
    const task: Task = {
        id: crypto.randomUUID(),
        title: title.trim(),
        status: "todo",
    };
    const tasks = loadTasks();
    const next = [...tasks, task];
    saveTasks(next);
    return task;
}

export function updateTask(id: string, patch: Partial<Pick<Task, "title" | "status">>): Task[]{
    const tasks = loadTasks();
    const next = tasks.map((t) => {
        if (t.id !== id) return t;
        return {
            ...t,
            ...(patch.title !== undefined ? { title: patch.title } : {}),
            ...(patch.status !== undefined ? { status: patch.status } : {}),
        };
    });
    saveTasks(next);
    return next;
}

export function deleteTask(id: string): Task[] {
    const tasks = loadTasks();
    const next = tasks.filter((t) => t.id !== id);
    saveTasks(next);
    return next;
}

