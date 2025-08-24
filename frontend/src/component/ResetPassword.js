import React, { useState, useContext } from "react";
import {
  Grid,
  Button,
  Typography,
  Paper,
  Box,
  Avatar,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import LockIcon from "@material-ui/icons/Lock";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

import PasswordInput from "../lib/PasswordInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.light,
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
    width: "100%",
    maxWidth: "500px",
    borderRadius: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(1.5, 0),
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: 700,
  },
  inputBox: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
}));

const ResetPassword = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const { token } = useParams();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [passwordDetails, setPasswordDetails] = useState({
    password: "",
    confirmPassword: "",
  });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    password: {
      error: false,
      message: "",
    },
    confirmPassword: {
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setPasswordDetails({
      ...passwordDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        error: status,
        message: message,
      },
    });
  };

  const handleSubmit = async () => {
    // Reset errors
    setError("");
    
    // Validate password
    if (passwordDetails.password.trim() === "") {
      handleInputError("password", true, "Password is required");
      return;
    } else if (passwordDetails.password.length < 8) {
      handleInputError("password", true, "Password must be at least 8 characters");
      return;
    } else {
      handleInputError("password", false, "");
    }

    // Validate confirm password
    if (passwordDetails.confirmPassword.trim() === "") {
      handleInputError("confirmPassword", true, "Please confirm your password");
      return;
    } else if (passwordDetails.password !== passwordDetails.confirmPassword) {
      handleInputError("confirmPassword", true, "Passwords do not match");
      return;
    } else {
      handleInputError("confirmPassword", false, "");
    }

    setIsLoading(true);

    try {
      const response = await axios.post(apiList.resetPassword, {
        token,
        newPassword: passwordDetails.password,
      });

      setSuccess(true);
      setPopup({
        open: true,
        severity: "success",
        message: response.data.message || "Password has been reset successfully",
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        history.push("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
      setPopup({
        open: true,
        severity: "error",
        message:
          err.response?.data?.message ||
          "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockIcon fontSize="large" />
        </Avatar>
        <Typography component="h1" variant="h5" className={classes.title}>
          Reset Your Password
        </Typography>

        {error && (
          <Alert severity="error" style={{ width: "100%", marginBottom: 16 }}>
            {error}
          </Alert>
        )}

        {success ? (
          <>
            <Alert severity="success" style={{ width: "100%", marginBottom: 16 }}>
              Password reset successful!
            </Alert>
            <Typography variant="body1" style={{ marginBottom: 16, textAlign: "center" }}>
              You will be redirected to the login page in a few seconds...
            </Typography>
          </>
        ) : (
          <div className={classes.form}>
            <PasswordInput
              label="New Password"
              value={passwordDetails.password}
              onChange={(e) => handleInput("password", e.target.value)}
              className={classes.inputBox}
              error={inputErrorHandler.password.error}
              helperText={inputErrorHandler.password.message}
              onBlur={(e) => {
                if (e.target.value === "") {
                  handleInputError("password", true, "Password is required");
                } else if (e.target.value.length < 8) {
                  handleInputError(
                    "password",
                    true,
                    "Password must be at least 8 characters"
                  );
                } else {
                  handleInputError("password", false, "");
                }
              }}
            />

            <PasswordInput
              label="Confirm Password"
              value={passwordDetails.confirmPassword}
              onChange={(e) => handleInput("confirmPassword", e.target.value)}
              className={classes.inputBox}
              error={inputErrorHandler.confirmPassword.error}
              helperText={inputErrorHandler.confirmPassword.message}
              onBlur={(e) => {
                if (e.target.value === "") {
                  handleInputError(
                    "confirmPassword",
                    true,
                    "Please confirm your password"
                  );
                } else if (e.target.value !== passwordDetails.password) {
                  handleInputError(
                    "confirmPassword",
                    true,
                    "Passwords do not match"
                  );
                } else {
                  handleInputError("confirmPassword", false, "");
                }
              }}
            />

            <Button
              variant="contained"
              color="primary"
              className={classes.submitButton}
              onClick={handleSubmit}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? (
                <div className={classes.loadingContainer}>
                  <CircularProgress size={24} color="inherit" />
                  <Typography variant="body2" style={{ marginLeft: 8 }}>
                    Resetting...
                  </Typography>
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        )}
      </Paper>
    </div>
  );
};

export default ResetPassword;