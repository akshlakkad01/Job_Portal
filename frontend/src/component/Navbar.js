import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  makeStyles,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  IconButton,
} from "@material-ui/core";
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Description as ApplicationIcon,
  ExitToApp as LogoutIcon,
  Add as AddIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import isAuth, { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  },
  toolbar: {
    minHeight: 80,
    padding: theme.spacing(0, 4),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(0, 6),
    },
  },
  title: {
    flexGrow: 1,
    fontWeight: 700,
    fontSize: "2.25rem",
    letterSpacing: "-0.015em",
    cursor: "pointer",
    color: "#1565C0",
    transition: "color 0.2s ease",
    "&:hover": {
      color: "#0D47A1",
    },
  },
  navButton: {
    marginLeft: theme.spacing(2),
    textTransform: "none",
    fontWeight: 600,
    fontSize: "1.15rem",
    padding: theme.spacing(1.5, 3),
    borderRadius: 10,
    color: "#64748B",
    position: "relative",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#F8FAFC",
      color: "#334155",
    },
    "&.active": {
      color: "#1565C0",
      backgroundColor: "#E3F2FD",
    },
  },
  primaryButton: {
    backgroundColor: "#1565C0",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "1.1rem",
    padding: theme.spacing(1.5, 3.5),
    borderRadius: 10,
    textTransform: "none",
    boxShadow: "0 2px 8px rgba(21, 101, 192, 0.2)",
    "&:hover": {
      backgroundColor: "#0D47A1",
      boxShadow: "0 4px 12px rgba(21, 101, 192, 0.3)",
    },
  },
  secondaryButton: {
    color: "#1565C0",
    border: "1.5px solid #1565C0",
    borderRadius: 10,
    fontSize: "1.1rem",
    padding: theme.spacing(1.5, 3.5),
    textTransform: "none",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#E3F2FD",
    },
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(3),
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: "#1565C0",
    fontSize: "1.5rem",
    fontWeight: 700,
  },
  userButton: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    padding: theme.spacing(1.5, 2.5),
    borderRadius: 10,
    textTransform: "none",
    color: "#334155",
    fontWeight: 600,
    fontSize: "1.1rem",
    "&:hover": {
      backgroundColor: "#F8FAFC",
    },
  },
  menuItem: {
    padding: theme.spacing(2, 3),
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#334155",
    "&:hover": {
      backgroundColor: "#F8FAFC",
    },
  },
  menuIcon: {
    marginRight: theme.spacing(2),
    fontSize: "1.5rem",
    color: "#64748B",
  },
  divider: {
    margin: theme.spacing(1.5, 0),
  },
  navSection: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
  },
  authSection: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(3),
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const navigateTo = (path) => {
    history.push(path);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getUserInitials = () => {
    // This would typically come from user data
    // For now, return placeholder based on user type
    return userType() === "recruiter" ? "R" : "A";
  };

  const renderAuthenticatedContent = () => {
    if (userType() === "recruiter") {
      return (
        <Box className={classes.userSection}>
          <Box className={classes.navSection}>
            <Button
              className={classes.navButton}
              startIcon={<HomeIcon />}
              onClick={() => navigateTo("/")}
            >
              Home
            </Button>
            <Button
              className={classes.navButton}
              startIcon={<WorkIcon />}
              onClick={() => navigateTo("/jobs")}
            >
              Search Jobs
            </Button>
            <Button
              className={classes.navButton}
              startIcon={<AddIcon />}
              onClick={() => navigateTo("/addjob")}
            >
              Post Job
            </Button>
            <Button
              className={classes.navButton}
              startIcon={<WorkIcon />}
              onClick={() => navigateTo("/myjobs")}
            >
              My Jobs
            </Button>
            <Button
              className={classes.navButton}
              startIcon={<PeopleIcon />}
              onClick={() => navigateTo("/employees")}
            >
              Applicants
            </Button>
          </Box>
          
          <Button
            className={classes.userButton}
            onClick={handleMenuOpen}
            endIcon={<ArrowDownIcon />}
          >
            <Avatar className={classes.avatar}>{getUserInitials()}</Avatar>
          </Button>
        </Box>
      );
    } else {
      return (
        <Box className={classes.userSection}>
          <Box className={classes.navSection}>
            <Button
              className={classes.navButton}
              startIcon={<HomeIcon />}
              onClick={() => navigateTo("/")}
            >
              Home
            </Button>
            <Button
              className={classes.navButton}
              startIcon={<WorkIcon />}
              onClick={() => navigateTo("/jobs")}
            >
              Search Jobs
            </Button>
            <Button
              className={classes.navButton}
              startIcon={<ApplicationIcon />}
              onClick={() => navigateTo("/applications")}
            >
              Applications
            </Button>
          </Box>
          
          <Button
            className={classes.userButton}
            onClick={handleMenuOpen}
            endIcon={<ArrowDownIcon />}
          >
            <Avatar className={classes.avatar}>{getUserInitials()}</Avatar>
          </Button>
        </Box>
      );
    }
  };

  const renderUnauthenticatedContent = () => (
    <Box className={classes.authSection}>
      <Button
        className={classes.secondaryButton}
        onClick={() => navigateTo("/login")}
      >
        Login
      </Button>
      <Button
        className={classes.primaryButton}
        onClick={() => navigateTo("/signup")}
      >
        Sign Up
      </Button>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" className={classes.appBar} elevation={0}>
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h6"
            className={classes.title}
            onClick={() => navigateTo("/")}
          >
            JobPortal
          </Typography>
          
          {isAuth() ? renderAuthenticatedContent() : renderUnauthenticatedContent()}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            marginTop: 8,
            minWidth: 200,
            borderRadius: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <MenuItem className={classes.menuItem} onClick={() => navigateTo("/profile")}>
          <PersonIcon className={classes.menuIcon} />
          Profile
        </MenuItem>
        <Divider className={classes.divider} />
        <MenuItem className={classes.menuItem} onClick={() => navigateTo("/logout")}>
          <LogoutIcon className={classes.menuIcon} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;