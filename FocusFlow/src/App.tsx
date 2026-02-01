import { Button } from "@mui/material";
import { useState } from "react";



export default function App()
{
  type Task = {
    id: number;
    title: string;
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState<string>("");

  const handleAdd = ()=>{
    if (!name.trim()) return;
      const newTask: Task = {
      id: Date.now(),
      title: name,
    };
    setTasks(prev => [...prev, newTask]);
    setName("");
  }

  const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return(
    <>
      <div>
        <h1>FocusFlow</h1>
        <input type="text" value={name} onChange={(e) => 
          setName(e.target.value)}/> 
        <button onClick={handleAdd}>Add</button>

        <ul>
          {tasks.map((t) =>
            <li key={t.id}>{t.title} { } <button onClick={() => handleDelete(t.id)}>delete</button></li>
          )}
        </ul>
      </div>
    </>
  );
}