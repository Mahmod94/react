import { useState } from "react";
import type { Task } from "../types/task";


type Props = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function TasksPage({ tasks, setTasks} : Props) {

  const [name, setName] = useState("");

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
