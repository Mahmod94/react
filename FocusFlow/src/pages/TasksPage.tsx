import { useState } from "react";
import type { Task } from "../types/task";


export default function TasksPage()
{
    const [tasks, setTasks] = useState<Task[]>([]);
    const [name, setName] = useState<string>("");

    const handleAdd = ()=>{
        if (!name.trim()) return;
        const newTask: Task = {
            id: Date.now(),
            title: name,
            status: "todo",
        };
        setTasks(prev => [...prev, newTask]);
        setName("");
    }

    const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
}


    return(
        <>
            <h1>Tasks</h1>
            <input type="text" value={name} onChange={(e) => 
            setName(e.target.value)}/> 
            <button onClick={handleAdd}>Add</button>
            <ul>
            {tasks.map((t) =>
            <li key={t.id}>{t.title} <button onClick={() => handleDelete(t.id)}>delete</button></li>
            )}
            </ul> 
        </>
    );
}