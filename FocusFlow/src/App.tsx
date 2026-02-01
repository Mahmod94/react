import { Button } from "@mui/material";
import { useState } from "react";



export default function App()
{
  type Task = [
    id: number,
    name: string,
  ];

  const [task, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState<String>();

  return(
    <>
      <div>
        <h1>FocusFlow</h1>
        <input type="text" value={name}/>
      </div>
    </>
  );
}