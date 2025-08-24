import React, { useState, useContext, useCallback } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Box,
  Card,
  CardContent,
  Avatar,
  Divider,
  Container,
  IconButton,
  InputAdornment,
  Fade,
  Zoom,
  LinearProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";
import PersonIcon from "@material-ui/icons/Person";
import BusinessIcon from "@material-ui/icons/Business";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import SchoolIcon from "@material-ui/icons/School";
import CodeIcon from "@material-ui/icons/Code";
import PhoneIcon from "@material-ui/icons/Phone";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import { Redirect } from "react-router-dom";
import ChipInput from "material-ui-chip-input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import FileUploadInput from "../lib/FileUploadInput";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";
import WorkIcon from "@material-ui/icons/Work";
import DeleteIcon from "@material-ui/icons/Delete";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
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
    minHeight: 600,
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
    justifyContent: 'flex-start',
    padding: theme.spacing(6, 4),
    paddingTop: theme.spacing(8),
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      flex: 'unset',
      padding: theme.spacing(4, 2),
      paddingTop: theme.spacing(6),
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
  sectionTitle: {
    fontWeight: 700,
    color: '#667eea',
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontSize: '1.15rem',
    letterSpacing: 0.5,
  },
  inputBox: {
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
  errorAlert: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    fontSize: '1rem',
    borderRadius: theme.spacing(1),
    boxShadow: '0 2px 8px rgba(255,0,0,0.08)',
  },
  cardSection: {
    marginBottom: theme.spacing(3.5),
  },
  divider: {
    margin: theme.spacing(3, 0),
    background: '#e0e0e0',
  },
  educationCard: {
    border: '1.5px solid #e0e0e0',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    background: 'rgba(245, 247, 250, 0.8)',
    transition: 'all 0.3s',
    '&:hover': {
      borderColor: '#667eea',
      background: 'rgba(255,255,255,0.95)',
      transform: 'translateY(-2px)',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.10)',
    },
  },
  addButton: {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1, 2),
    background: 'rgba(102, 126, 234, 0.08)',
    color: '#667eea',
    border: '2px solid rgba(102, 126, 234, 0.18)',
    fontWeight: 600,
    '&:hover': {
      background: 'rgba(102, 126, 234, 0.18)',
      borderColor: '#667eea',
    },
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneContainer: {
    marginBottom: theme.spacing(2),
  },
}));

const Signup = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    email: "",
    password: "",
    name: "",
    skills: [],
    resume: "",
    profile: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: { untouched: true, required: true, error: false, message: "" },
    password: { untouched: true, required: true, error: false, message: "" },
    name: { untouched: true, required: true, error: false, message: "" },
  });

  const handleInput = useCallback((key, value) => {
    setSignupDetails(prev => ({
      ...prev,
      [key]: value,
    }));
    
    if (error) setError("");
  }, [error]);

  const handleInputError = useCallback((key, status, message) => {
    setInputErrorHandler(prev => ({
      ...prev,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    }));
  }, []);

  const validateForm = () => {
    let isValid = true;
    const tmpErrorHandler = {};

    // Validate required fields
    Object.keys(inputErrorHandler).forEach((key) => {
      if (inputErrorHandler[key].required && inputErrorHandler[key].untouched) {
        tmpErrorHandler[key] = {
          required: true,
          untouched: false,
          error: true,
          message: `${key.charAt(0).toUpperCase() + key.slice(1)} is required`,
        };
        isValid = false;
      } else {
        tmpErrorHandler[key] = inputErrorHandler[key];
      }
    });

    // Additional validation
    if (!signupDetails.name.trim()) {
      tmpErrorHandler.name = {
        required: true,
        untouched: false,
        error: true,
        message: "Name is required",
      };
      isValid = false;
    }

    if (!signupDetails.email.trim()) {
      tmpErrorHandler.email = {
        required: true,
        untouched: false,
        error: true,
        message: "Email is required",
      };
      isValid = false;
    }

    if (!signupDetails.password.trim()) {
      tmpErrorHandler.password = {
        required: true,
        untouched: false,
        error: true,
        message: "Password is required",
      };
      isValid = false;
    }

    setInputErrorHandler(tmpErrorHandler);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let updatedDetails = { ...signupDetails };

      if (signupDetails.type === "applicant") {
        // Remove education logic
        // updatedDetails.education = education
        //   .filter(obj => obj.institutionName.trim() !== "")
        //   .map(obj => {
        //     if (obj.endYear === "") {
        //       delete obj.endYear;
        //     }
        //     return obj;
        //   });
      } else {
        updatedDetails.contactNumber = phone ? `+${phone}` : "";
      }

      console.log("Sending data:", updatedDetails);
      console.log("Signup URL:", apiList.signup);

      const response = await axios.post(apiList.signup, updatedDetails);
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("type", response.data.type);
        
        setLoggedin(isAuth());
        
        setPopup({
          open: true,
          severity: "success",
          message: "Account created successfully!",
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      console.error("Error response:", err.response);
      console.error("Error request:", err.request);
      
      let errorMessage = "An error occurred during signup. Please try again.";
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.message || err.response.statusText;
        console.error("Server error response:", err.response.data);
      } else if (err.request) {
        // Network error
        errorMessage = "Network error. Please check your connection and try again.";
        console.error("Network error:", err.request);
      } else {
        // Other error
        errorMessage = err.message || errorMessage;
      }
      
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

  if (loggedin) {
    // Redirect recruiters to welcome page, applicants to search jobs page
    const userTypeValue = localStorage.getItem("type");
    if (userTypeValue === "recruiter") {
      return <Redirect to="/home" />;
    } else {
      return <Redirect to="/" />;
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.mainCard}>
        <div className={classes.leftPanel}>
          <Avatar className={classes.welcomeIcon}>
            <CheckCircleIcon style={{ fontSize: 48, color: '#fff' }} />
          </Avatar>
          <Typography className={classes.leftTitle}>
            Welcome!
          </Typography>
          <Typography className={classes.leftSubtitle}>
            {signupDetails.type === 'applicant'
              ? 'Create your job seeker account and start applying to your dream jobs.'
              : 'Sign up as a recruiter and find the best talent for your company.'}
          </Typography>
          <Divider className={classes.dividerVertical} orientation="vertical" flexItem />
        </div>
        <div className={classes.rightPanel}>
          <Typography variant="h4" className={classes.title}>
            Create Your Account
          </Typography>
          {error && (
            <Alert severity="error" className={classes.errorAlert}>
              {error}
            </Alert>
          )}
          <div className={classes.cardSection}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <PersonIcon style={{ color: '#764ba2' }} />
              Account Type
            </Typography>
            <TextField
              select
              label="I am a..."
              variant="outlined"
              value={signupDetails.type}
              onChange={(event) => handleInput("type", event.target.value)}
              fullWidth
              className={classes.inputBox}
            >
              <MenuItem value="applicant">Job Seeker</MenuItem>
              <MenuItem value="recruiter">Recruiter</MenuItem>
            </TextField>
          </div>
          <Divider className={classes.divider} />
          <div className={classes.cardSection}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <EmailIcon style={{ color: '#667eea' }} />
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Full Name"
                  value={signupDetails.name}
                  onChange={(event) => handleInput("name", event.target.value)}
                  variant="outlined"
                  fullWidth
                  required
                  error={inputErrorHandler.name.error}
                  helperText={inputErrorHandler.name.message}
                  onBlur={(event) => {
                    if (event.target.value === "") {
                      handleInputError("name", true, "Name is required");
                    } else {
                      handleInputError("name", false, "");
                    }
                  }}
                  className={classes.inputBox}
                />
              </Grid>
              <Grid item xs={12}>
                <EmailInput
                  label="Email Address"
                  value={signupDetails.email}
                  onChange={(event) => handleInput("email", event.target.value)}
                  inputErrorHandler={inputErrorHandler}
                  handleInputError={handleInputError}
                  className={classes.inputBox}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <PasswordInput
                  label="Password"
                  value={signupDetails.password}
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
                />
              </Grid>
            </Grid>
          </div>
          <Divider className={classes.divider} />
          {signupDetails.type === "applicant" ? (
            <>
              <div className={classes.cardSection}>
                <Typography variant="h6" className={classes.sectionTitle}>
                  <WorkIcon style={{ color: '#667eea' }} />
                  Skills
                </Typography>
                <ChipInput
                  className={classes.inputBox}
                  label="Skills"
                  variant="outlined"
                  helperText="Press enter to add skills"
                  value={signupDetails.skills}
                  onAdd={(chip) =>
                    handleInput("skills", [...signupDetails.skills, chip])
                  }
                  onDelete={(chip, index) => {
                    const newSkills = [...signupDetails.skills];
                    newSkills.splice(index, 1);
                    handleInput("skills", newSkills);
                  }}
                  fullWidth
                />
              </div>
              <div className={classes.cardSection}>
                <Typography variant="h6" className={classes.sectionTitle}>
                  <DescriptionIcon style={{ color: '#764ba2' }} />
                  Documents
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FileUploadInput
                      className={classes.inputBox}
                      label="Resume (.pdf)"
                      icon={<DescriptionIcon />}
                      uploadTo={apiList.uploadResume}
                      handleInput={handleInput}
                      identifier="resume"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FileUploadInput
                      className={classes.inputBox}
                      label="Profile Photo (.jpg/.png)"
                      icon={<FaceIcon />}
                      uploadTo={apiList.uploadProfileImage}
                      handleInput={handleInput}
                      identifier="profile"
                    />
                  </Grid>
                </Grid>
              </div>
            </>
          ) : (
            <>
              <div className={classes.cardSection}>
                <Typography variant="h6" className={classes.sectionTitle}>
                  <PersonIcon style={{ color: '#764ba2' }} />
                  About You
                </Typography>
                <TextField
                  label="Bio (up to 250 words)"
                  multiline
                  rows={6}
                  variant="outlined"
                  value={signupDetails.bio}
                  onChange={(event) => {
                    const wordCount = event.target.value.split(" ").filter(n => n !== "").length;
                    if (wordCount <= 250) {
                      handleInput("bio", event.target.value);
                    }
                  }}
                  fullWidth
                  helperText={`${signupDetails.bio.split(" ").filter(n => n !== "").length}/250 words`}
                  className={classes.inputBox}
                />
              </div>
              <div className={classes.cardSection}>
                <Typography variant="h6" className={classes.sectionTitle}>
                  <PhoneIcon style={{ color: '#667eea' }} />
                  Contact Information
                </Typography>
                <div className={classes.phoneContainer}>
                  <PhoneInput
                    country="in"
                    value={phone}
                    onChange={setPhone}
                  />
                </div>
              </div>
            </>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className={classes.submitButton}
            disabled={isLoading}
            size="large"
          >
            {isLoading ? (
              <div className={classes.loadingContainer}>
                <CircularProgress size={24} color="inherit" />
                <Typography variant="body2" style={{ marginLeft: 8 }}>
                  Creating Account...
                </Typography>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;