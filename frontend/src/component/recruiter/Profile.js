import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  makeStyles,
  TextField,
  Divider,
} from "@material-ui/core";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import FaceIcon from "@material-ui/icons/Face";
import DescriptionIcon from "@material-ui/icons/Description";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";

import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";
import FileUploadInput from "../../lib/FileUploadInput";

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

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    email: "",
    bio: "",
    contactNumber: "",
    resume: "",
    profile: "",
  });

  const [phone, setPhone] = useState("");

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProfileDetails(response.data);
        setPhone(response.data.contactNumber);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const handleUpdate = () => {
    let updatedDetails = {
      ...profileDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...profileDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...profileDetails,
        contactNumber: "",
      };
    }

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
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  };

  return (
    <div className={classes.root}>
      <div className={classes.mainCard}>
        <div className={classes.leftPanel}>
          <FaceIcon className={classes.welcomeIcon} style={{ fontSize: 48, color: '#fff' }} />
          <Typography className={classes.leftTitle}>
            Recruiter Profile
          </Typography>
          <Typography className={classes.leftSubtitle}>
            View and update your recruiter information and contact details.
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
              <DescriptionIcon style={{ color: '#667eea' }} />
              About You
            </Typography>
            <Grid container direction="column" alignItems="stretch" spacing={3}>
              <Grid item>
                <TextField
                  label="Bio (up to 250 words)"
                  multiline
                  rows={6}
                  className={classes.inputBox}
                  variant="outlined"
                  value={profileDetails.bio}
                  onChange={(event) => {
                    const wordCount = event.target.value.split(" ").filter(function (n) {
                      return n !== "";
                    }).length;
                    if (wordCount <= 250) {
                      handleInput("bio", event.target.value);
                    }
                  }}
                  fullWidth
                  helperText={`${profileDetails.bio.split(" ").filter(n => n !== "").length}/250 words`}
                />
              </Grid>
            </Grid>
          </div>
          
          <Divider className={classes.divider} />
          
          <div style={{ marginBottom: 24 }}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <PhoneIcon style={{ color: '#667eea' }} />
              Contact Information
            </Typography>
            <Grid container direction="column" alignItems="stretch" spacing={3}>
              <Grid item>
                <Typography variant="subtitle2" style={{ marginBottom: 8, fontWeight: 600, color: '#666' }}>
                  Contact Number
                </Typography>
                <PhoneInput
                  country={"in"}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  inputStyle={{ width: '100%' }}
                  containerStyle={{ width: '100%' }}
                />
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
