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
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";

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
  filterBar: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
    padding: theme.spacing(2, 3),
    marginBottom: theme.spacing(4),
    position: "sticky",
    top: 0,
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    gap: 24,
    width: "100%",
    maxWidth: 900,
    margin: "0 auto",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "stretch",
      gap: 12,
      padding: theme.spacing(2, 1),
      maxWidth: '100%',
    },
  },
  searchInput: {
    flex: 1,
    background: "#f7f9fc",
    borderRadius: 8,
    minWidth: 200,
    maxWidth: 400,
  },
  filterIcon: {
    marginLeft: 12,
    color: theme.palette.primary.main,
    background: "#e3e9f6",
    borderRadius: 8,
    '&:hover': {
      background: "#d0d8ee",
    },
  },
  jobListWrapper: {
    maxWidth: 900,
    margin: "0 auto",
    width: "100%",
    padding: theme.spacing(0, 2),
    [theme.breakpoints.down("xs")]: {
      maxWidth: '100%',
      padding: theme.spacing(0, 1),
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
  applyButton: {
    padding: theme.spacing(1.5, 7),
    borderRadius: 8,
    fontWeight: 600,
    marginTop: 16,
    fontSize: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  filterModalPaper: {
    padding: theme.spacing(6, 7),
    outline: "none",
    minWidth: 320,
    borderRadius: 18,
    background: "#fff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
  },
  noJobs: {
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

const JobTile = (props) => {
  const classes = useStyles();
  const { job } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");
  const handleClose = () => {
    setOpen(false);
    setSop("");
  };
  const handleApply = () => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      setPopup({ open: true, severity: "error", message: "Please login to apply for jobs" });
      return;
    }
    
    console.log("Applying for job:", job._id);
    console.log("SOP:", sop);
    console.log("Token:", token ? "Present" : "Missing");
    
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        { sop: sop },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log("Application successful:", response.data);
        setPopup({ open: true, severity: "success", message: response.data.message });
        handleClose();
      })
      .catch((err) => {
        console.error("Application failed:", err);
        console.error("Error response:", err.response?.data);
        setPopup({ open: true, severity: "error", message: err.response?.data?.message || "Error applying for job" });
        handleClose();
      });
  };
  const deadline = new Date(job.deadline).toLocaleDateString();
  return (
    <Paper className={classes.jobTileOuter} elevation={0}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={9}>
          <Typography variant="h5" className={classes.jobTitle}>{job.title}</Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <Rating value={job.rating !== -1 ? job.rating : null} readOnly size="small" />
            <Box ml={1} color="#6b7280" fontSize={14}>
              {job.recruiter.name}
            </Box>
          </Box>
          <Box className={classes.jobMeta}>Role: {job.jobType}</Box>
          <Box className={classes.jobMeta}>Salary: <b>&#8377; {job.salary}</b> per month</Box>
          <Box className={classes.jobMeta}>Duration: {job.duration !== 0 ? `${job.duration} month` : `Flexible`}</Box>
          <Box className={classes.jobMeta}>Application Deadline: <b>{deadline}</b></Box>
          <Box mt={1} mb={1} display="flex" flexWrap="wrap">
            {job.skillsets.map((skill) => (
              <Chip label={skill} className={classes.chip} key={skill} />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} sm={3} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <Button
            variant="contained"
            color="primary"
            className={classes.applyButton}
            style={{ minWidth: 120 }}
            onClick={() => setOpen(true)}
            disabled={userType() === "recruiter"}
          >
            {localStorage.getItem("token") ? "Apply" : "Login to Apply"}
          </Button>
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper className={classes.modalPaper}>
          <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 18 }}>Submit Statement of Purpose</Typography>
          <TextField
            label="Write SOP (up to 250 words)"
            multiline
            rows={8}
            className={classes.searchInput}
            variant="outlined"
            value={sop}
            onChange={(event) => {
              if (
                event.target.value.split(" ").filter(function (n) { return n !== ""; }).length <= 250
              ) {
                setSop(event.target.value);
              }
            }}
            style={{ marginBottom: 30 }}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.applyButton}
            onClick={handleApply}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const FilterPopup = (props) => {
  const classes = useStyles();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  return (
    <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
      <Paper className={classes.filterModalPaper}>
        <Grid container direction="column" alignItems="center" spacing={3}>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Job Type
            </Grid>
            <Grid
              container
              item
              xs={9}
              justify="space-around"
              // alignItems="center"
            >
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="fullTime"
                      checked={searchOptions.jobType.fullTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Full Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="partTime"
                      checked={searchOptions.jobType.partTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Part Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="wfh"
                      checked={searchOptions.jobType.wfh}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Work From Home"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Salary
            </Grid>
            <Grid item xs={9}>
              <Slider
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => {
                  return value * (100000 / 100);
                }}
                marks={[
                  { value: 0, label: "0" },
                  { value: 100, label: "100000" },
                ]}
                value={searchOptions.salary}
                onChange={(event, value) =>
                  setSearchOptions({
                    ...searchOptions,
                    salary: value,
                  })
                }
              />
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Duration
            </Grid>
            <Grid item xs={9}>
              <TextField
                select
                label="Duration"
                variant="outlined"
                fullWidth
                value={searchOptions.duration}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    duration: event.target.value,
                  })
                }
              >
                <MenuItem value="0">All</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="7">7</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Sort
            </Grid>
            <Grid item container direction="row" xs={9}>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="salary"
                    checked={searchOptions.sort.salary.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="salary"
                  />
                </Grid>
                <Grid item>
                  <label for="salary">
                    <Typography>Salary</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.salary.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            desc: !searchOptions.sort.salary.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.salary.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="duration"
                    checked={searchOptions.sort.duration.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="duration"
                  />
                </Grid>
                <Grid item>
                  <label for="duration">
                    <Typography>Duration</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.duration.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            desc: !searchOptions.sort.duration.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.duration.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="rating"
                    checked={searchOptions.sort.rating.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="rating"
                  />
                </Grid>
                <Grid item>
                  <label for="rating">
                    <Typography>Rating</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.rating.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            desc: !searchOptions.sort.rating.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.rating.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px" }}
              onClick={() => {
                handleClose();
                getData();
              }}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

const SearchJob = (props) => {
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: { fullTime: false, partTime: false, wfh: false },
    salary: [0, 100],
    duration: "0",
    sort: {
      salary: { status: false, desc: false },
      duration: { status: false, desc: false },
      rating: { status: false, desc: false },
    },
  });
  const setPopup = useContext(SetPopupContext);
  // Add a useEffect to fetch data when component mounts
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Add a separate useEffect to handle search and filter changes
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  
  // Add a function to handle search button click
  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
    getData();
  };
  const getData = () => {
    let searchParams = [];
    if (searchOptions.query !== "") searchParams.push(`q=${searchOptions.query}`);
    if (searchOptions.jobType.fullTime) searchParams.push(`jobType=Full%20Time`);
    if (searchOptions.jobType.partTime) searchParams.push(`jobType=Part%20Time`);
    if (searchOptions.jobType.wfh) searchParams.push(`jobType=Work%20From%20Home`);
    if (searchOptions.salary[0] !== 0) searchParams.push(`salaryMin=${searchOptions.salary[0] * 1000}`);
    if (searchOptions.salary[1] !== 100) searchParams.push(`salaryMax=${searchOptions.salary[1] * 1000}`);
    if (searchOptions.duration !== "0") searchParams.push(`duration=${searchOptions.duration}`);
    let asc = [], desc = [];
    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) desc.push(`desc=${obj}`);
        else asc.push(`asc=${obj}`);
      }
    });
    
    // Add pagination parameters
    searchParams.push(`page=${page}`);
    searchParams.push(`limit=${limit}`);
    
    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    
    // Use public endpoint for job seekers (no authentication required)
    let address = `${apiList.jobs}/public`;
    if (queryString !== "") address = `${address}?${queryString}`;
    console.log("Making API call to:", address);
    axios
      .get(address)
      .then((response) => {
        console.log("API Response:", response.data);
        // Set jobs directly from response without filtering by deadline
        // Add a check to ensure response.data.jobs exists
        if (response.data && response.data.jobs) {
          setJobs(response.data.jobs);
          setTotalJobs(response.data.totalCount || 0);
        } else {
          // If jobs is undefined, set an empty array
          setJobs([]);
          setTotalJobs(0);
          console.log("No jobs data in response:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        console.error("Error response:", error.response?.data);
        setJobs([]);
        setTotalJobs(0);
        setPopup({ open: true, severity: "error", message: "Error fetching jobs" });
      });
  };
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  return (
    <div className={classes.body}>
      <div className={classes.header}>
        <Typography variant={isMobile ? "h4" : "h3"} style={{ fontWeight: 700, letterSpacing: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <WorkOutlineIcon style={{ fontSize: isMobile ? 32 : 40, marginBottom: -6 }} />
          Jobs
        </Typography>
        <Typography variant="subtitle1" style={{ marginTop: 8, opacity: 0.85, fontWeight: 400 }}>
          Discover and apply to the latest opportunities
        </Typography>
      </div>
      <div className={classes.filterBar}>
        <TextField
          label="Search Jobs"
          value={searchOptions.query}
          onChange={(event) => setSearchOptions({ ...searchOptions, query: event.target.value })}
          onKeyPress={(ev) => { if (ev.key === "Enter") handleSearch(); }}
          InputProps={{
            className: classes.searchInput,
            endAdornment: (
              <InputAdornment>
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        <IconButton className={classes.filterIcon} onClick={() => setFilterOpen(true)}>
          <FilterListIcon />
        </IconButton>
      </div>
      <div className={classes.jobListWrapper}>
        {jobs.length > 0 ? (
          <>
            {jobs.map((job) => <JobTile job={job} key={job._id} />)}
            <Box display="flex" justifyContent="center" mt={4} mb={4}>
              <Pagination 
                count={Math.ceil(totalJobs / limit)} 
                page={page} 
                onChange={(e, newPage) => setPage(newPage)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        ) : (
          <div className={classes.noJobs}>
            <WorkOutlineIcon style={{ fontSize: 48, opacity: 0.3 }} />
            <Typography variant="h5">No jobs found</Typography>
            <Typography variant="body1" style={{ color: '#b0b8c9', fontWeight: 400 }}>
              Try adjusting your filters or search keywords.
            </Typography>
          </div>
        )}
      </div>
      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={handleSearch}
      />
    </div>
  );
};

export default SearchJob;
