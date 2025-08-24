import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
  Box,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import axios from "axios";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    minHeight: "100vh",
    background: "#f4f8fb",
    width: "100%",
    padding: 0,
    margin: 0,
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    width: "100%",
    background: theme.palette.primary.main,
    color: "#fff",
    padding: theme.spacing(5, 0, 3, 0),
    textAlign: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    marginBottom: theme.spacing(4),
  },
  mainCard: {
    maxWidth: 900,
    margin: "0 auto",
    width: "100%",
    borderRadius: 16,
    boxShadow: "0 8px 40px rgba(102, 126, 234, 0.15)",
    background: "#fff",
    padding: theme.spacing(4, 3),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2, 1),
      maxWidth: '100%',
    },
  },
  jobTileOuter: {
    padding: theme.spacing(4, 3),
    margin: theme.spacing(0, 0, 4, 0),
    boxSizing: "border-box",
    width: "100%",
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    background: "#fff",
    transition: "box-shadow 0.2s, transform 0.2s",
    '&:hover': {
      boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
      transform: "translateY(-2px) scale(1.01)",
    },
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2, 1),
    },
  },
  chip: {
    marginRight: 6,
    marginBottom: 4,
    background: "#e3e9f6",
    color: theme.palette.primary.main,
    fontWeight: 500,
    fontSize: 13,
  },
  jobTitle: {
    fontWeight: 700,
    color: theme.palette.primary.main,
    marginBottom: 4,
    fontSize: 22,
    letterSpacing: 0.5,
  },
  jobMeta: {
    color: "#6b7280",
    fontSize: 15,
    marginBottom: 2,
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 15,
    marginBottom: 8,
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalPaper: {
    padding: theme.spacing(4, 5),
    outline: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 320,
    alignItems: "center",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    background: "#fff",
  },
  rateButton: {
    marginTop: 8,
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 15,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    width: "100%",
  },
  noApplications: {
    textAlign: "center",
    marginTop: theme.spacing(10),
    color: '#8a94a6',
    fontWeight: 500,
    fontSize: 22,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
}));

const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application.job.rating);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const fetchRating = () => {
    axios
      .get(`${apiList.rating}?id=${application.job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setRating(response.data.rating);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const changeRating = () => {
    axios
      .put(
        apiList.rating,
        { rating: rating, jobId: application.job._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: "Rating updated successfully",
        });
        fetchRating();
        setOpen(false);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        fetchRating();
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#DC851F",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
    cancelled: "#FF8484",
    finished: "#4EA5D9",
  };

  return (
    <Paper className={classes.jobTileOuter} elevation={0}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={9}>
          <Typography variant="h5" className={classes.jobTitle}>{application.job.title}</Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <Rating value={application.job.rating !== -1 ? application.job.rating : null} readOnly size="small" />
            <Box ml={1} color="#6b7280" fontSize={14}>
              {application.recruiter.name}
            </Box>
          </Box>
          <Box className={classes.jobMeta}>Role: {application.job.jobType}</Box>
          <Box className={classes.jobMeta}>Salary: <b>&#8377; {application.job.salary}</b> per month</Box>
          <Box className={classes.jobMeta}>Duration: {application.job.duration !== 0 ? `${application.job.duration} month` : `Flexible`}</Box>
          <Box className={classes.jobMeta}>Applied On: <b>{appliedOn.toLocaleDateString()}</b></Box>
          {(application.status === "accepted" || application.status === "finished") && (
            <Box className={classes.jobMeta}>Joined On: <b>{joinedOn.toLocaleDateString()}</b></Box>
          )}
          <Box mt={1} mb={1} display="flex" flexWrap="wrap">
            {application.job.skillsets.map((skill) => (
              <Chip label={skill} className={classes.chip} key={skill} />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} sm={3} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
          <Paper
            className={classes.statusBlock}
            style={{
              background: colorSet[application.status],
              color: "#ffffff",
              marginBottom: 12,
            }}
            elevation={0}
          >
            {application.status}
          </Paper>
          {(application.status === "accepted" || application.status === "finished") && (
            <Button
              variant="contained"
              color="primary"
              className={classes.rateButton}
              onClick={() => {
                fetchRating();
                setOpen(true);
              }}
            >
              Rate Job
            </Button>
          )}
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper className={classes.modalPaper}>
          <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 18 }}>Rate this Job</Typography>
          <Rating
            name="simple-controlled"
            style={{ marginBottom: "30px" }}
            value={rating === -1 ? null : rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
            onClick={() => changeRating()}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const Applications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    console.log("Making API call to:", apiList.applications);
    console.log("Token:", localStorage.getItem("token") ? "Present" : "Missing");
    
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Applications API Response:", response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        console.error("Error fetching applications:", err);
        console.error("Error response:", err.response?.data);
        setApplications([]);
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Error fetching applications",
        });
      });
  };

  return (
    <div className={classes.body}>
      <div className={classes.header}>
        <Typography variant={isMobile ? "h4" : "h3"} style={{ fontWeight: 700, letterSpacing: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <WorkOutlineIcon style={{ fontSize: isMobile ? 32 : 40, marginBottom: -6 }} />
          Applications
        </Typography>
        <Typography variant="subtitle1" style={{ marginTop: 8, opacity: 0.85, fontWeight: 400 }}>
          View all your job applications and their statuses
        </Typography>
      </div>
      <div className={classes.mainCard}>
        {applications.length > 0 ? (
          applications.map((obj) => (
            <ApplicationTile application={obj} key={obj._id} />
          ))
        ) : (
          <div className={classes.noApplications}>
            <SentimentDissatisfiedIcon style={{ fontSize: 48, opacity: 0.3 }} />
            <Typography variant="h5">No Applications Found</Typography>
            <Typography variant="body1" style={{ color: '#b0b8c9', fontWeight: 400 }}>
              You haven't applied to any jobs yet.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
