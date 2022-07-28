import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import userApi from "../api/userApi";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

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
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const [role, setRole] = React.useState("Student");


  const isMenuOpen = Boolean(anchorEl);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const logout = async () => {
    await userApi.logout();
    localStorage.removeItem("user");
    handleMenuClose();
    navigate("/login", { replace: true });
  };

  const myInfo = async () => {
    handleMenuClose();
    navigate("/MyInfo", { replace: true });
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {role!=="Student"?<MenuItem onClick={myInfo}>Cá nhân</MenuItem>:''}
      <MenuItem onClick={logout}>Đăng xuất</MenuItem>
    </Menu>
  );

  React.useEffect(() => {
    InitRole();
  }, []);


  function InitRole() {
    const item = JSON.parse(localStorage.getItem('user'));
    if (item) {
      setRole(item.role);
    }
  }

  function handleSetIconAdmin(index) {
    switch (index) {
      case 0:
        return (<AnalyticsIcon />);
      case 1:
        return (<AppRegistrationIcon />);
      case 2:
        return (<RecentActorsIcon />);
      case 3:
        return (<FilterListIcon />);
      case 4:
        return (<ClearAllIcon />);
      case 5:
        return (<PeopleOutlineIcon />);
      default:
        return (<MailIcon />);
    }
  }

  function handleSetIconStudent(index) {
    switch (index) {
      case 0:
        return (<AnalyticsIcon />);
      case 1:
        return (<GroupsIcon />);
      case 2:
        return (<ClearAllIcon />);
      case 3:
        return (<AssignmentIcon />);
      case 4:
        return (<AssignmentTurnedInIcon />);
      case 5:
        return (<RecentActorsIcon />);
      case 6:
        return (<FilterListIcon />);
      default:
        return (<MailIcon />);
    }
  }

  function handleSetIconTeacher(index) {
    switch (index) {
      case 0:
        return (<AnalyticsIcon />);
      case 1:
        return (<ClearAllIcon />);
      case 2:
        return (<FactCheckIcon />);
      case 3:
        return (<RecentActorsIcon />);
      case 4:
        return (<FilterListIcon />);
      default:
        return (<MailIcon />);
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Hệ thống quản lí đăng kí dự án CNTT
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {role === 'Admin' ?
          <List>
            {["Trang chủ",
              "Đợt đăng kí",
              "Danh sách sinh viên",
              "Quản lí đề tài trong đợt",
              "Danh sách tất cả đề tài",
              "Quản lí tài khoản"].map((text, index) => (
                <ListItem key={text} disablePadding sx={{ display: "block" }}
                  onClick={() => {
                    switch (index) {
                      case 0:
                        navigate("/", { replace: true });
                        break;
                      case 1:
                        navigate("/admin/Period", { replace: true });
                        break;
                      case 2:
                        navigate("/admin/PeriodStudent", { replace: true });
                        break;
                      case 3:
                        navigate("/admin/PeriodTopic", { replace: true });
                        break;
                      case 4:
                        navigate("/admin/Topic", { replace: true });
                        break;
                      case 5:
                        navigate("/admin/AccountManager", { replace: true });
                        break;
                    }
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {/* {index === 0 ? <AnalyticsIcon /> :
                      (index === 1 ? <AppRegistrationIcon /> :<MailIcon />) } */}
                      {handleSetIconAdmin(index)}

                    </ListItemIcon>
                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List> :
          (role === 'Teacher' ?
            <List>
              {["Trang chủ",
                "Danh sách tất cả đề tài",
                "Duyệt đăng kí",
                "Danh sách sinh viên",
                "Danh sách đề tài mở"].map((text, index) => (
                  <ListItem key={text} disablePadding sx={{ display: "block" }}
                    onClick={() => {
                      switch (index) {
                        case 0:
                          break;
                        case 1:
                          navigate("/Topic", { replace: true });
                          break;
                        case 2:
                          navigate("/ApprovalPTS", { replace: true });
                          break;
                        case 3:
                          navigate("/PeriodStudent", { replace: true });
                          break;
                        case 4:
                          navigate("/PeriodTopic", { replace: true });
                          break;
                      }
                    }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                        {handleSetIconTeacher(index)}
                      </ListItemIcon>
                      <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List> :
            <List>
              {["Trang chủ",
                "Nhóm",
                "Danh sách đề tài",
                "Đăng kí",
                "Danh sách đã đăng kí",
                "Danh sách sinh viên",
                "Danh sách đề tài mở"].map((text, index) => (
                  <ListItem key={text} disablePadding sx={{ display: "block" }}
                    onClick={() => {
                      switch (index) {
                        case 0:
                          break;
                        case 1:
                          navigate("/GroupStudent", { replace: true });
                          break;
                        case 2:
                          navigate("/Topic", { replace: true });
                          break;
                        case 3:
                          navigate("/PeriodTopicStudent", { replace: true });
                          break;
                        case 4:
                          navigate("/MyPeriodTopicStudent", { replace: true });
                          break;
                        case 5:
                          navigate("/PeriodStudent", { replace: true });
                          break;
                        case 6:
                          navigate("/PeriodTopic", { replace: true });
                          break;
                      }
                    }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                        {handleSetIconStudent(index)}
                      </ListItemIcon>
                      <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>)}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
