import { useEffect, useState } from "react";
import type { Task } from "../types/task";


type Props = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function TasksPage({ tasks, setTasks} : Props) {
  // const [tasks, setTasks] = useState<Task[]>(() => {
  //   try {
  //     const raw = localStorage.getItem(STORAGE_KEY);
  //     console.log("LOADED RAW:", raw);
  //     if (!raw) return [];
  //     const parsed = JSON.parse(raw);
  //     return Array.isArray(parsed) ? (parsed as Task[]) : [];
  //   } catch (err) {
  //     console.error("Failed to load tasks:", err);
  //     return [];
  //   }
  // });

  const [name, setName] = useState("");

  // useEffect(() => {
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  //   console.log("SAVED", tasks);
  // }, [tasks]);

  const handleAdd = () => {
    const title = name.trim();
    if (!title) return;

    const newTask: Task = { id: crypto.randomUUID(), title, status: "todo" };
    setTasks((prev) => [...prev, newTask]);
    setName("");
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      <h1>Tasks</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="button" onClick={handleAdd}>Add</button>

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title}{" "}
            <button type="button" onClick={() => handleDelete(t.id)}>
              delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
