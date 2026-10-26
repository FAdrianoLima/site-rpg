import * as React from "react";

import { styled, createTheme, ThemeProvider } from "@mui/material/styles";

import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";

import Link from "next/link";
import { useRouter } from "next/router";

const drawerWidth = 250;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,

  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,

    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    boxSizing: "border-box",

    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),

    ...(!open && {
      overflowX: "hidden",
      width: theme.spacing(7),

      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },

      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }),
  },
}));

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#A78BFA",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#C084FC",
    },

    background: {
      default: "#0B0A10",
      paper: "#15131D",
    },

    text: {
      primary: "#F5F3FF",
      secondary: "#A6A0B5",
    },
  },

  typography: {
    fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),
  },
});

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    label: "Usuários",
    path: "/usuarios",
    icon: <PeopleAltIcon />,
  },
  {
    label: "Mesas",
    path: "/mesas",
    icon: <GroupsIcon />,
  },
  {
    label: "Sistemas de RPG",
    path: "/sistemas",
    icon: <AutoAwesomeIcon />,
  },
  {
    label: "Personagens",
    path: "/personagens",
    icon: <PersonIcon />,
  },
  {
    label: "Configurações",
    path: "/configuracoes",
    icon: <SettingsIcon />,
  },
];

const pageTitles = {
  "/dashboard": "Dashboard",
  "/usuarios": "Usuários",
  "/mesas": "Mesas de RPG",
  "/sistemas": "Sistemas de RPG",
  "/personagens": "Personagens",
  "/configuracoes": "Configurações",
};

const Admin = ({ children, showLoader = false }) => {
  const [open, setOpen] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    if (!router.isReady) return;

    const isAuth = localStorage.getItem("isAuth");

    if (!isAuth) {
      router.replace("/");
      return;
    }

    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  }, [router.isReady, router]);

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("user");

    router.replace("/");
  };

  const toggleDrawer = () => {
    setOpen((current) => !current);
  };

  const currentPath = router.pathname;

  const tituloPagina =
    pageTitles[currentPath] ||
    (currentPath.startsWith("/personagens/")
      ? "Ficha de personagem"
      : currentPath.startsWith("/sistemas/")
        ? "Sistema de RPG"
        : currentPath.startsWith("/mesas/")
          ? "Mesa de RPG"
          : "No Die");

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CssBaseline />

        <AppBar
          position="fixed"
          open={open}
          sx={{
            bgcolor: "#15131D",
            borderBottom: "1px solid rgba(196,181,253,0.12)",
            boxShadow: "none",
          }}
        >
          <Toolbar sx={{ minHeight: "64px", px: 3 }}>
            <IconButton
              edge="start"
              aria-label="Abrir menu"
              onClick={toggleDrawer}
              sx={{
                color: "white",
                mr: 2,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              component="h1"
              variant="h6"
              sx={{ flexGrow: 1, fontWeight: 600 }}
              noWrap
            >
              {tituloPagina}
            </Typography>

            <Tooltip title="Sair">
              <IconButton
                aria-label="Sair da conta"
                onClick={handleLogout}
                sx={{ color: "white" }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          open={open}
          sx={{
            "& .MuiDrawer-paper": {
              bgcolor: "#100E17",
              color: "#F5F3FF",
              borderRight: "1px solid rgba(196,181,253,0.12)",
            },
          }}
        >
          <Toolbar
            sx={{
              minHeight: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 1.5,
            }}
          >
            {open && (
              <Box sx={{ pl: 1.5, flexGrow: 1 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: "0.12em",
                    color: "#C4B5FD",
                  }}
                >
                  NO DIE
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", letterSpacing: "0.08em" }}
                >
                  RPG CHARACTER SYSTEM
                </Typography>
              </Box>
            )}

            <Tooltip title={open ? "Recolher menu" : "Expandir menu"}>
              <IconButton
                onClick={toggleDrawer}
                aria-label={open ? "Recolher menu" : "Expandir menu"}
                sx={{ color: "text.secondary" }}
              >
                {open ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
            </Tooltip>
          </Toolbar>

          <Divider sx={{ borderColor: "rgba(196,181,253,0.12)" }} />

          <List sx={{ px: 1, pt: 1.5 }}>
            {menuItems.map((item) => {
              const ativo =
                currentPath === item.path ||
                currentPath.startsWith(`${item.path}/`);

              return (
                <ListItem disablePadding key={item.path} sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    href={item.path}
                    selected={ativo}
                    sx={{
                      minHeight: 48,
                      borderRadius: "10px",
                      px: 1.5,

                      "&.Mui-selected": {
                        bgcolor: "rgba(167,139,250,0.14)",
                        color: "#C4B5FD",

                        "& .MuiListItemIcon-root": {
                          color: "#C4B5FD",
                        },
                      },

                      "&.Mui-selected:hover": {
                        bgcolor: "rgba(167,139,250,0.20)",
                      },

                      "&:hover": {
                        bgcolor: "rgba(167,139,250,0.08)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 42,
                        color: ativo ? "#C4B5FD" : "#A6A0B5",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: "0.92rem",
                        fontWeight: ativo ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            minHeight: "100vh",
            overflow: "auto",
            bgcolor: "background.default",
          }}
        >
          <Toolbar />

          {showLoader && <LinearProgress />}

          <Container
            maxWidth="xl"
            sx={{
              mt: 3,
              mb: 4,
              px: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {children}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Admin;
