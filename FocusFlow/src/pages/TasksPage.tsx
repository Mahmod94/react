// import { useState } from "react";
// import type { Task } from "../types/task";
// import { Typography } from "@mui/material";


// type Props = {
//   tasks: Task[];
//   setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
// }

// export default function TasksPage({ tasks, setTasks} : Props) {

//   const [name, setName] = useState("");

//   const handleAdd = () => {
//     const title = name.trim();
//     if (!title) return;

//     const newTask: Task = { id: crypto.randomUUID(), title, status: "todo" };
//     setTasks((prev) => [...prev, newTask]);
//     setName("");
//   };

//   const handleDelete = (id: string) => {
//     setTasks((prev) => prev.filter((t) => t.id !== id));
//   };

//   return (
//     <>
//       <Typography variant="h4" component="h2" sx={{ color: "#C45AB3"}}>Tasks</Typography>
//       <input value={name} onChange={(e) => setName(e.target.value)} />
//       <button type="button" onClick={handleAdd}>Add</button>

//       <ul>
//         {tasks.map((t) => (
//           <li key={t.id}>
//             {t.title}{" "}
//             <button type="button" onClick={() => handleDelete(t.id)}>
//               delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }

import { useMemo, useState } from "react";
import { Button, Checkbox, TextField, Typography } from "@mui/material";
import type { Task } from "../types/task";

type Props = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

export default function TasksPage({ tasks, setTasks }: Props)
{
  const [name, setName] = useState("");

  // editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  const handleAdd = () => {
    const title = name.trim();
    if (!title) return;

    const newTask: Task = { id: crypto.randomUUID(), title, status: "todo"};
    setTasks((prev) => [...prev, newTask]);
    setName("");
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setDraftTitle("");
    }
  };

  const toggleDone = (id: string) => {
    setTasks((prev) => 
      prev.map((t) =>
        t.id === id ? {...t, status: t.status === "done" ? "todo" : "done"} : t
      )
    );
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setDraftTitle(task.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftTitle("");
  }

  const saveEdit = (id: string) => {
    const next = draftTitle.trim();
    if (!next) return;

    setTasks((prev) => prev.map((t) => (t.id === id ? {...t, title: next } : t)));
    setEditingId(null);
    setDraftTitle("");
  };

  const doneCount = useMemo(
    () => tasks.filter((t) => t.status === "done").length,
    [tasks]
  );

  return(
    <div>
      <Typography variant="h4" component="h2" gutterBottom sx={{ color: "#C45AB3"}}>
        Tasks
      </Typography>

      <Typography variant="body2" sx={{ mb: 2}}>
        Done: {doneCount}/{tasks.length}
      </Typography>

      <div style={{ display: "flex", gap: 8, marginBottom: 16}}>
        <TextField
          size="small"
          label="New task"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          />
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0}}>
        {tasks.map((t) => {
          const isEditing = editingId === t.id;
          const isDone = t.status === "done";

          return(
            <li
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 0",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
              }}
              >
                <Checkbox
                  checked={isDone}
                  onChange={() => toggleDone(t.id)}
                  inputProps={{ "aria-label": "toggle done"}}
                  />

                  <div style={{ flex: 1}}>
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(t.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                        fullWidth
                        />
                      ): (
                        <span
                          style={{
                            textDecoration: isDone ? "line-through" : "none",
                            opacity: isDone ? +.6: 1,
                          }}
                          >
                            {t.title}
                          </span>
                    )}
                  </div>
                  {isEditing ? (
                    <>
                      <Button size="small" onClick={() => saveEdit(t.id)}>
                        Save
                      </Button>
                      <Button size="small" onClick={() => cancelEdit}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="small" onClick={() => startEdit(t)}>
                        Edit
                      </Button>
                      <Button size="small" onClick={() => handleDelete(t.id)}>
                        Delete
                      </Button>
                    </>
                  )}
            </li>
          )
        })}
      </ul>

    </div>
  );
}