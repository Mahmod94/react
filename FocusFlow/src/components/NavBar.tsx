import { AppBar, Toolbar, Stack} from "@mui/material";
import { Link } from "react-router-dom";

export default function NavBar(){
    return (
        <AppBar position="static">
            <Toolbar>
                <Stack direction="row" spacing={3}>
                    <Link to="/" style={{ color: "white", textDecoration: "none"}}>
                    Tasks
                    </Link>

                    <Link to="/promodoropage" style={{ color: "white", textDecoration:"none"}}>
                    Promodoro
                    </Link>

                    <Link to="/statspage" style={{color: "white", textDecoration: "none"}}>
                    Stats
                    </Link>
                </Stack>
            </Toolbar>
        </AppBar>
    )
}