import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";

export default function NavBar() {
  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>

        <Button component={RouterLink} to="/" color="inherit" size="large">
          Manage Users
        </Button>
        <Button component={RouterLink} to="/products" color="inherit" size="large">
          Products
        </Button>
        <Button component={RouterLink} to="/contact" color="inherit" size="large">
          Contact
        </Button>

        <Typography sx={{ flexGrow: 1 }} />

        <Button color="inherit" size="small">
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}
