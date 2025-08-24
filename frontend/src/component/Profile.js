import { useContext, useEffect, useState, useCallback } from "react";
import {
  Button,
  Grid,
  Typography,
  Modal,
  Paper,
  makeStyles,
  TextField,
  Divider,
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";
import FileUploadInput from "../lib/FileUploadInput";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import WorkIcon from "@material-ui/icons/Work";

import { SetPopupContext } from "../App";

import apiList, { server } from "../lib/apiList";

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
    marginBottom: theme.spacing(2.5),
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
  divider: {
    margin: theme.spacing(3, 0),
    background: '#e0e0e0',
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
}));

const Profile = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [userData, setUserData] = useState();
  const [open, setOpen] = useState(false);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    email: "",
    skills: [],
    resume: "",
    profile: "",
  });
  
  // Keep a separate state for skills to prevent loss during navigation
  const [skills, setSkills] = useState([]);

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  const getData = useCallback(() => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Profile API Response:", response.data);
        const { education, ...rest } = response.data;
        console.log("Profile Details after processing:", rest);
        // Ensure skills is always an array
        const processedData = {
          ...rest,
          skills: Array.isArray(rest.skills) ? rest.skills : []
        };
        console.log("Final processed data:", processedData);
        setProfileDetails(processedData);
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          console.log(err.response.data);
        } else {
          console.log(err);
        }
        setPopup({
          open: true,
          severity: "error",
          message: (err.response && err.response.data && err.response.data.message) || err.message || "Error",
        });
      });
  }, [setPopup]);

  useEffect(() => {
    getData();
  }, []);
  
  // Update skills state when profileDetails changes
  useEffect(() => {
    if (profileDetails.skills && Array.isArray(profileDetails.skills)) {
      setSkills(profileDetails.skills);
    }
  }, [profileDetails.skills]);

  const handleClose = () => {
    setOpen(false);
  };

  const editDetails = () => {
    setOpen(true);
  };

  const handleUpdate = () => {
    let updatedDetails = {
      ...profileDetails,
      skills: skills, // Ensure we're using the skills from the separate state
    };

    axios
      .put(apiList.user, updatedDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          console.log(err.response.data);
        } else {
          console.log(err);
        }
        setPopup({
          open: true,
          severity: "error",
          message: (err.response && err.response.data && err.response.data.message) || err.message || "Error",
        });
      });
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <div className={classes.mainCard}>
        <div className={classes.leftPanel}>
          <FaceIcon className={classes.welcomeIcon} style={{ fontSize: 48, color: '#fff' }} />
          <Typography className={classes.leftTitle}>
            Your Profile
          </Typography>
          <Typography className={classes.leftSubtitle}>
            View and update your personal information, skills, and documents.
          </Typography>
          <div>
            <div className={classes.dividerVertical} style={{ height: 200 }} />
          </div>
        </div>
        <div className={classes.rightPanel}>
          <Typography variant="h4" className={classes.title}>
            Profile Details
          </Typography>
          
          <div style={{ marginBottom: 24 }}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <PersonIcon style={{ color: '#667eea' }} />
              Basic Information
            </Typography>
            <Grid container direction="column" alignItems="stretch" spacing={3}>
              <Grid item>
                <TextField
                  label="Full Name"
                  value={profileDetails.name}
                  onChange={(event) => handleInput("name", event.target.value)}
                  className={classes.inputBox}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Email Address"
                  value={profileDetails.email}
                  className={classes.inputBox}
                  variant="outlined"
                  fullWidth
                  disabled
                  helperText="Email cannot be changed"
                />
              </Grid>
            </Grid>
          </div>
          
          <Divider className={classes.divider} />
          
          <div style={{ marginBottom: 24 }}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <WorkIcon style={{ color: '#667eea' }} />
              Skills & Expertise
            </Typography>
            <Grid container direction="column" alignItems="stretch" spacing={3}>
              <Grid item>
                <ChipInput
                  className={classes.inputBox}
                  label="Skills"
                  variant="outlined"
                  helperText="Press enter to add skills"
                  value={skills}
                  onAdd={(chip) => {
                    const updatedSkills = [...skills, chip];
                    setSkills(updatedSkills);
                    setProfileDetails({
                      ...profileDetails,
                      skills: updatedSkills,
                    });
                  }}
                  onDelete={(chip, index) => {
                    const updatedSkills = [...skills];
                    updatedSkills.splice(index, 1);
                    setSkills(updatedSkills);
                    setProfileDetails({
                      ...profileDetails,
                      skills: updatedSkills,
                    });
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </div>
          
          <Divider className={classes.divider} />
          <div style={{ marginBottom: 24 }}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <DescriptionIcon style={{ color: '#667eea' }} />
              Documents & Media
            </Typography>
            <Grid container direction="column" alignItems="stretch" spacing={3}>
              <Grid item>
                <FileUploadInput
                  className={classes.inputBox}
                  label="Resume (.pdf)"
                  icon={<DescriptionIcon />}
                  uploadTo={apiList.uploadResume}
                  handleInput={handleInput}
                  identifier={"resume"}
                />
                {profileDetails.resume && (
                  <div style={{ marginTop: 8 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      style={{ marginRight: 8 }}
                      onClick={() => {
                        // Use the direct URL from the server
                        const fileUrl = `${server}${profileDetails.resume}`;
                        window.open(fileUrl, '_blank');
                      }}
                    >
                      View Resume
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        const fileUrl = `${server}${profileDetails.resume}`;
                        axios(fileUrl, {
                          method: "GET",
                          responseType: "blob",
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                        })
                          .then((response) => {
                            const file = new Blob([response.data], { type: "application/pdf" });
                            const fileURL = URL.createObjectURL(file);
                            const link = document.createElement('a');
                            link.href = fileURL;
                            link.download = 'resume.pdf';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          })
                          .catch((error) => {
                            setPopup({
                              open: true,
                              severity: "error",
                              message: "Error downloading resume",
                            });
                          });
                      }}
                    >
                      Download Resume
                    </Button>
                  </div>
                )}
              </Grid>
              <Grid item>
                <FileUploadInput
                  className={classes.inputBox}
                  label="Profile Photo (.jpg/.png)"
                  icon={<FaceIcon />}
                  uploadTo={apiList.uploadProfileImage}
                  handleInput={handleInput}
                  identifier={"profile"}
                />
                {profileDetails.profile && (
                  <div style={{ marginTop: 8 }}>
                    <img
                      src={`${server}${profileDetails.profile}`}
                      alt="Profile"
                      style={{ 
                        maxWidth: 120, 
                        maxHeight: 120,
                        objectFit: 'cover',
                        borderRadius: 8, 
                        border: '2px solid #e0e0e0',
                        marginBottom: 8
                      }}
                      onError={(e) => {
                        console.error("Image failed to load:", profileDetails.profile);
                        e.target.src = 'https://via.placeholder.com/120?text=Profile';
                      }}
                    />
                    <Typography variant="caption" display="block" style={{ color: '#666' }}>
                      Profile photo uploaded successfully
                    </Typography>
                  </div>
                )}
              </Grid>
            </Grid>
          </div>
          <Button
            variant="contained"
            color="primary"
            className={classes.submitButton}
            onClick={() => handleUpdate()}
          >
            Update Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
