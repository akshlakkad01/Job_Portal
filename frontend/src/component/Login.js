import React, { useContext, useState, useCallback } from "react";
import {
  Grid,
  Button,
  Typography,
  Paper,
  Box,
  Avatar,
  Divider,
  CircularProgress,
  Modal,
  TextField,
  Link,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import LockIcon from "@material-ui/icons/Lock";
import { Redirect } from "react-router-dom";
import axios from "axios";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth, { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  forgotPasswordLink: {
    marginTop: theme.spacing(1),
    textAlign: 'right',
    cursor: 'pointer',
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    outline: 'none',
    maxWidth: 400,
    width: '100%',
  },
  modalTitle: {
    marginBottom: theme.spacing(3),
    fontWeight: 700,
    textAlign: 'center',
  },
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
  },
  mainCard: {
    display: 'flex',
    flexDirection: 'row',
    maxWidth: 900,
    width: '100%',
    minHeight: 500,
    borderRadius: theme.spacing(3),
    boxShadow: '0 8px 40px rgba(102, 126, 234, 0.15)',
    overflow: 'hidden',
    background: '#fff',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      minHeight: 'unset',
    },
  },
  leftPanel: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6, 4),
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      flex: 'unset',
      padding: theme.spacing(4, 2),
    },
  },
  welcomeIcon: {
    width: 90,
    height: 90,
    marginBottom: theme.spacing(2),
    background: 'rgba(255,255,255,0.15)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  leftTitle: {
    fontWeight: 700,
    fontSize: '2rem',
    marginBottom: theme.spacing(1),
    letterSpacing: 1,
  },
  leftSubtitle: {
    fontWeight: 400,
    fontSize: '1.1rem',
    opacity: 0.9,
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
  dividerVertical: {
    width: 2,
    background: 'rgba(255,255,255,0.1)',
    margin: theme.spacing(0, 0),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  rightPanel: {
    flex: 2,
    padding: theme.spacing(6, 6),
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4, 2),
    },
  },
  title: {
    fontWeight: 800,
    marginBottom: theme.spacing(2),
    color: '#333',
    fontSize: '2.2rem',
    letterSpacing: 1,
    textAlign: 'center',
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
  },
  inputBox: {
    width: '100%',
    marginBottom: theme.spacing(2.5),
  },
  submitButton: {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1.5, 4),
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontWeight: 700,
    fontSize: '1.1rem',
    textTransform: 'none',
    boxShadow: '0 4px 18px rgba(102, 126, 234, 0.18)',
    marginTop: theme.spacing(3),
    transition: 'all 0.3s',
    '&:hover': {
      background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
      transform: 'translateY(-2px) scale(1.03)',
      boxShadow: '0 8px 28px rgba(102, 126, 234, 0.25)',
    },
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorAlert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    fontSize: '1rem',
    borderRadius: theme.spacing(1),
    boxShadow: '0 2px 8px rgba(255,0,0,0.08)',
  },
}));

const Login = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Forgot password modal state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmailLoading, setResetEmailLoading] = useState(false);

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });
  
  // Reset email validation
  const [resetEmailError, setResetEmailError] = useState({
    error: false,
    message: "",
  });

  const handleInput = useCallback((key, value) => {
    setLoginDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (error) {
      setError("");
    }
  }, [error]);

  const handleInputError = useCallback((key, status, message) => {
    setInputErrorHandler((prev) => ({
      ...prev,
      [key]: {
        error: status,
        message: message,
      },
    }));
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!loginDetails.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginDetails.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!loginDetails.password.trim()) {
      errors.password = "Password is required";
    } else if (loginDetails.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    setInputErrorHandler((prev) => ({
      ...prev,
      email: {
        ...prev.email,
        error: !!errors.email,
        message: errors.email || "",
      },
      password: {
        ...prev.password,
        error: !!errors.password,
        message: errors.password || "",
      },
    }));
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(apiList.login, loginDetails);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("type", response.data.type);
        setLoggedin(isAuth());
        setPopup({
          open: true,
          severity: "success",
          message: "Logged in successfully!",
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during login. Please try again.";
      setError(errorMessage);
      setPopup({
        open: true,
        severity: "error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };
  
  // Handle forgot password modal open/close
  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
    setResetEmail("");
    setResetEmailSent(false);
    setResetEmailError({
      error: false,
      message: "",
    });
  };
  
  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
  };
  
  // Validate reset email
  const validateResetEmail = () => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (resetEmail.trim() === "") {
      setResetEmailError({
        error: true,
        message: "Email is required",
      });
      return false;
    } else if (!emailRegex.test(resetEmail)) {
      setResetEmailError({
        error: true,
        message: "Invalid email address",
      });
      return false;
    }
    setResetEmailError({
      error: false,
      message: "",
    });
    return true;
  };
  
  // Handle password reset request
  const handlePasswordReset = async () => {
    if (!validateResetEmail()) return;
    
    setResetEmailLoading(true);
    try {
      const response = await axios.post(apiList.forgotPassword, { email: resetEmail });
      
      setResetEmailSent(true);
      setPopup({
        open: true,
        severity: "success",
        message: response.data.message || "Password reset link has been sent to your email",
      });
    } catch (err) {
      setPopup({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "Failed to send reset email. Please try again.",
      });
    } finally {
      setResetEmailLoading(false);
    }
  };

  if (loggedin) {
    // Redirect recruiters to welcome page, applicants to search jobs page
    const userTypeValue = userType();
    if (userTypeValue === "recruiter") {
      return <Redirect to="/" />;
    } else {
      return <Redirect to="/jobs" />;
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.mainCard}>
        <div className={classes.leftPanel}>
          <Avatar className={classes.welcomeIcon}>
            <LockIcon style={{ fontSize: 48, color: '#fff' }} />
          </Avatar>
          <Typography className={classes.leftTitle}>
            Welcome Back!
          </Typography>
          <Typography className={classes.leftSubtitle}>
            Log in to your account to continue your job search or manage your postings.
          </Typography>
          <Divider className={classes.dividerVertical} orientation="vertical" flexItem />
        </div>
        <div className={classes.rightPanel}>
          <Typography variant="h4" className={classes.title}>
            Login to Your Account
          </Typography>
          {error && (
            <Alert severity="error" className={classes.errorAlert}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <EmailInput
                label="Email Address"
                value={loginDetails.email}
                onChange={(event) => handleInput("email", event.target.value)}
                inputErrorHandler={inputErrorHandler}
                handleInputError={handleInputError}
                className={classes.inputBox}
                required
                onKeyPress={handleKeyPress}
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordInput
                label="Password"
                value={loginDetails.password}
                onChange={(event) => handleInput("password", event.target.value)}
                className={classes.inputBox}
                error={inputErrorHandler.password.error}
                helperText={inputErrorHandler.password.message}
                onBlur={(event) => {
                  if (event.target.value === "") {
                    handleInputError("password", true, "Password is required");
                  } else {
                    handleInputError("password", false, "");
                  }
                }}
                onKeyPress={handleKeyPress}
              />
              <Typography 
                variant="body2" 
                className={classes.forgotPasswordLink}
                onClick={handleForgotPasswordOpen}
              >
                Forgot Password?
              </Typography>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            className={classes.submitButton}
            disabled={isLoading}
            size="large"
            style={{ marginTop: 32 }}
          >
            {isLoading ? (
              <div className={classes.loadingContainer}>
                <CircularProgress size={24} color="inherit" />
                <Typography variant="body2" style={{ marginLeft: 8 }}>
                  Logging In...
                </Typography>
              </div>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      <Modal
        open={forgotPasswordOpen}
        onClose={handleForgotPasswordClose}
        className={classes.modal}
      >
        <div className={classes.modalContent}>
          <Typography variant="h5" className={classes.modalTitle}>
            Reset Your Password
          </Typography>
          
          {!resetEmailSent ? (
            <>
              <Typography variant="body1" style={{ marginBottom: 16 }}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>
              
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                error={resetEmailError.error}
                helperText={resetEmailError.message}
                style={{ marginBottom: 24 }}
                disabled={resetEmailLoading}
              />
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handlePasswordReset}
                disabled={resetEmailLoading}
                className={classes.submitButton}
              >
                {resetEmailLoading ? (
                  <div className={classes.loadingContainer}>
                    <CircularProgress size={24} color="inherit" />
                    <Typography variant="body2" style={{ marginLeft: 8 }}>
                      Sending...
                    </Typography>
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </>
          ) : (
            <>
              <Alert severity="success" style={{ marginBottom: 24 }}>
                Reset link sent! Check your email.
              </Alert>
              
              <Typography variant="body1" style={{ marginBottom: 24 }}>
                We've sent a password reset link to <strong>{resetEmail}</strong>. Please check your inbox and follow the instructions to reset your password.
              </Typography>
              
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleForgotPasswordClose}
              >
                Back to Login
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Login;