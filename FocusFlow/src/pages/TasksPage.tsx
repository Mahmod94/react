

import { useMemo, useState } from "react";
import {  Checkbox, TextField, Typography } from "@mui/material";
import type { Task } from "../types/task";
import { createTask, deleteTask, updateTask} from "../data/tasksRepo";

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';



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
  const task = createTask(title);
  setTasks((prev) => [...prev, task]);
  setName("");
};

const handleDelete = (id: string) => {
  const next = deleteTask(id);
  setTasks(next);
};

const toggleDone = (id: string) => {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  const nextStatus = t.status === "done" ? "todo" : "done";
  const next = updateTask(id, {status: nextStatus});
  setTasks(next);
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
    const nextTitle = draftTitle.trim();
    if (!nextTitle) return;
    const next = updateTask(id, { title: nextTitle });
    setTasks(next);
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
          <IconButton aria-label="add" size="small" onClick={handleAdd}>
            <AddIcon fontSize="inherit"/>
          </IconButton>
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
                      <IconButton aria-label="save" size="small" onClick={() => saveEdit(t.id)}>
                        <SaveIcon fontSize="inherit"/>
                      </IconButton>
                      <IconButton aria-label="cancel" size="small" onClick={() => cancelEdit}>
                        <CancelIcon fontSize="inherit"/>
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton aria-label="edit" size="small" onClick={() => startEdit(t)}>
                        <EditIcon fontSize="inherit"/>
                      </IconButton>
                      <IconButton aria-label="delete" size="small" onClick={() => handleDelete(t.id)}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </>
                  )}
            </li>
          )
        })}
      </ul>

    </div>
  );
}