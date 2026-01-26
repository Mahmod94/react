import {
  Button,
  IconButton,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

type User = {
  id: number;
  name: string;
};

export default function UsersPage() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const handleAddUser = () => {
    if (!name.trim()) return;

    setUsers((prev) => [
      ...prev,
      { id: Date.now(), name },
    ]);

    setName("");
  };

  const handleDeleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <>
      <Typography variant="h4">Users</Typography>

      <Stack
        spacing={2}
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddUser();
        }}
      >
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button type="submit">Add</Button>

        <List>
          {users.map((user) => (
            <ListItem
              key={user.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <DeleteIcon />
                </IconButton>
                
              }
            >
              {user.name}
            </ListItem>
          ))}
        </List>
      </Stack>
    </>
  );
}
