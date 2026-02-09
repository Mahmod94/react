import { Box, AppBar, Toolbar, Stack, Typography} from "@mui/material";
import { Link } from "react-router-dom";


export default function NavBar(){

    const menuItem = [
        {
            menuName: "Focus Flow",
            menuItems: [
                {
                    name: "Tasks",
                    href: "/",
                },
                {
                    name: "Promodoro",
                    href: "/promodoropage",
                },
                {
                    name: "Stats",
                    href: "/statspage"
                },
            ]
        }
    ];

    return(
        <AppBar position="fixed" sx={{ backgroundColor: "#CA9CE1" }}>
            <Toolbar>
                <Stack direction="row" spacing={3}>
                    {menuItem.map((menu) =>(
                        <Stack key={menu.menuName} direction="row" spacing={2}>
                            {menu.menuItems.map((item)=> (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    style={{ textDecoration: "none", color: "inherit" }}
                                    >
                                        <Typography variant="h6">
                                            {item.name}
                                        </Typography>
                                </Link>
                            ))}
                        </Stack>
                    ))}
                </Stack>
                <Box sx={{ flexGrow: 1}}></Box>
                <Typography variant="h6">Login</Typography>
            </Toolbar>
        </AppBar>
    );
}