import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Modal,
  Paper,
  makeStyles,
  TextField,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";

import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";

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

const CreateJobs = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [jobDetails, setJobDetails] = useState({
    title: "",
    maxApplicants: 100,
    maxPositions: 30,
    deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 16),
    skillsets: [],
    jobType: "Full Time",
    duration: 0,
    salary: 0,
  });

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleUpdate = () => {
    console.log(jobDetails);
    axios
      .post(apiList.jobs, jobDetails, {
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
        setJobDetails({
          title: "",
          maxApplicants: 100,
          maxPositions: 30,
          deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .substr(0, 16),
          skillsets: [],
          jobType: "Full Time",
          duration: 0,
          salary: 0,
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
  };

  return (
    <div className={classes.root}>
      <div className={classes.mainCard}>
        <div className={classes.leftPanel}>
          <Typography className={classes.leftTitle}>Create a New Job</Typography>
          <Typography className={classes.leftSubtitle}>
            Fill in the details to post a new job opening and find the best candidates for your company.
          </Typography>
        </div>
        <div className={classes.rightPanel}>
          <Typography className={classes.title}>Job Details</Typography>
          <form noValidate autoComplete="off">
            <TextField
              className={classes.inputBox}
              label="Title"
              value={jobDetails.title}
              onChange={(event) => handleInput("title", event.target.value)}
              variant="outlined"
              fullWidth
            />
            <ChipInput
              className={classes.inputBox}
              label="Skills"
              variant="outlined"
              helperText="Press enter to add skills"
              value={jobDetails.skillsets}
              onAdd={(chip) =>
                setJobDetails({
                  ...jobDetails,
                  skillsets: [...jobDetails.skillsets, chip],
                })
              }
              onDelete={(chip, index) => {
                let skillsets = jobDetails.skillsets.slice();
                skillsets.splice(index, 1);
                setJobDetails({
                  ...jobDetails,
                  skillsets: skillsets,
                });
              }}
              fullWidth
            />
            <TextField
              className={classes.inputBox}
              select
              label="Job Type"
              variant="outlined"
              value={jobDetails.jobType}
              onChange={(event) => {
                handleInput("jobType", event.target.value);
              }}
              fullWidth
            >
              <MenuItem value="Full Time">Full Time</MenuItem>
              <MenuItem value="Part Time">Part Time</MenuItem>
              <MenuItem value="Work From Home">Work From Home</MenuItem>
            </TextField>
            <TextField
              className={classes.inputBox}
              select
              label="Duration"
              variant="outlined"
              value={jobDetails.duration}
              onChange={(event) => {
                handleInput("duration", event.target.value);
              }}
              fullWidth
            >
              <MenuItem value={0}>Flexible</MenuItem>
              <MenuItem value={1}>1 Month</MenuItem>
              <MenuItem value={2}>2 Months</MenuItem>
              <MenuItem value={3}>3 Months</MenuItem>
              <MenuItem value={4}>4 Months</MenuItem>
              <MenuItem value={5}>5 Months</MenuItem>
              <MenuItem value={6}>6 Months</MenuItem>
            </TextField>
            <TextField
              className={classes.inputBox}
              label="Salary"
              type="number"
              variant="outlined"
              value={jobDetails.salary}
              onChange={(event) => {
                handleInput("salary", event.target.value);
              }}
              InputProps={{ inputProps: { min: 0 } }}
              fullWidth
            />
            <TextField
              className={classes.inputBox}
              label="Application Deadline"
              type="datetime-local"
              value={jobDetails.deadline}
              onChange={(event) => {
                handleInput("deadline", event.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              fullWidth
            />
            <TextField
              className={classes.inputBox}
              label="Maximum Number Of Applicants"
              type="number"
              variant="outlined"
              value={jobDetails.maxApplicants}
              onChange={(event) => {
                handleInput("maxApplicants", event.target.value);
              }}
              InputProps={{ inputProps: { min: 1 } }}
              fullWidth
            />
            <TextField
              className={classes.inputBox}
              label="Positions Available"
              type="number"
              variant="outlined"
              value={jobDetails.maxPositions}
              onChange={(event) => {
                handleInput("maxPositions", event.target.value);
              }}
              InputProps={{ inputProps: { min: 1 } }}
              fullWidth
            />
            <Button
              className={classes.submitButton}
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              fullWidth
            >
              Create Job
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJobs;
