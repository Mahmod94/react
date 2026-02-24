import React, {useMemo, useState} from "react";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  TextField,
  Typography  
} from "@mui/material"

import type { Task } from "../types/task";
import { createTask, deleteTask, updateTask } from "../data/tasksRepo";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";




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

  const isEditing = (id: string) => editingId === id;

  return(
    <Box sx={{ maxWidth: 720, mx: "auto", mt: 4, px: 2}}>
      <Typography variant="h4" component="h2" sx={{ mb: 1, fontWeight: 700}}>
        Tasks
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb : 2 }}>
        Done: {doneCount}/{tasks.length}
        </Typography>

        <Card>
          <CardContent>
            {/* Add row */}
            <Stack direction="row" spacing={1} sx={{ mb : 2 }}>
              <TextField
                size="small"
                label="New Task"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
                fullWidth
                />
                <IconButton aria-label="add" onClick={handleAdd}>
                  <AddIcon />
                </IconButton>
            </Stack>

            <Divider sx={{ mb : 1 }}/>

            {/* List */}
            <List disablePadding>
              {tasks.map((t, idx) => {
                const editing = isEditing(t.id);
                const done = t.status === "done";
                
                return (
                  <React.Fragment key={t.id}>
                    <ListItem
                      disableGutters
                      sx={{
                        py: 1,
                        alignItems: "center",
                      }}
                      >
                        <Checkbox
                          checked={done}
                          onChange={() => toggleDone(t.id)}
                          inputProps={{ "aria-label": "toggle done"}}
                          sx={{ mr: 1 }}
                          />

                          {/* Content */}
                          {editing ? (
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
                          ) : (
                            <ListItemText
                              primary={t.title}
                              primaryTypographyProps={{
                                sx: {
                                  textDecoration: done ? "line-through" : "none",
                                  opacity: done ? 0.6: 1,
                                  fontWeight: 500,
                                },
                              }}
                              />
                          )}

                          {/* Actions */}
                          <ListItemSecondaryAction>
                            {editing ? (
                              <Stack direction="row" spacing={0.5}>
                                <IconButton
                                  aria-label="save"
                                  size="small"
                                  onClick={() => saveEdit(t.id)}
                                  >
                                    <SaveIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    aria-label="cancel"
                                    size="small"
                                    onClick={cancelEdit}
                                    >
                                      <CancelIcon fontSize="small" />
                                    </IconButton>
                              </Stack>
                            ) : (
                              <Stack direction="row" spacing={0.5}>
                                <IconButton
                                  aria-label="edit"
                                  size="small"
                                  onClick={() => startEdit(t)}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    aria-label="delete"
                                    size="small"
                                    onClick={() => handleDelete(t.id)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                              </Stack>
                            )}
                          </ListItemSecondaryAction>
                      </ListItem>

                      {idx < tasks.length - 1 && <Divider />}
                  </React.Fragment>
                )
              })}
            </List>
          </CardContent>
        </Card>
    </Box>
  );
}