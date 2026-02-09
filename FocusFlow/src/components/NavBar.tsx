import { Box, AppBar, Toolbar, Stack, Typography} from "@mui/material";
import { Link } from "react-router-dom";

import { useState } from "react";

export default function NavBar(){

    const [ancorEl, setAncorEl] = useState<null | HTMLElement>(null);


    return (
        <Box sx={{ flexGrow: 1}}>
            <AppBar position="fixed" color="secondary">
                <Toolbar variant="dense">
                    <Stack direction="row" spacing={3}>
                        <Link to="/" style={{ color: "inhert", textDecoration: "none"}}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>Tasks</Typography>
                        </Link>

                        <Link to="/promodoropage" style={{ color: "inherit", textDecoration:"none"}}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
                            Promodoro
                            </Typography>
                        </Link>

                        <Link to="/statspage" style={{color: "inherit", textDecoration: "none"}}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
                            Stats
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
                            Login
                        </Typography>
                        </Link>
                    </Stack>
                </Toolbar>
            </AppBar>
        </Box>
    );
}