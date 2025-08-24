const mongoose = require("mongoose");
const Application = require("./db/Application");
const Job = require("./db/Job");
const User = require("./db/User");
const JobApplicant = require("./db/JobApplicant");
const Recruiter = require("./db/Recruiter");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/jobPortal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    checkApplications();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

async function checkApplications() {
  try {
    // Check if there are any applications in the database
    const applications = await Application.find({});
    console.log("Total applications in database:", applications.length);
    
    if (applications.length > 0) {
      console.log("Sample application:", applications[0]);
      
      // Check if the application has proper references
      const sampleApp = applications[0];
      console.log("Application details:");
      console.log("- ID:", sampleApp._id);
      console.log("- Job ID:", sampleApp.jobId);
      console.log("- User ID:", sampleApp.userId);
      console.log("- Recruiter ID:", sampleApp.recruiterId);
      console.log("- Status:", sampleApp.status);
      console.log("- Date of Application:", sampleApp.dateOfApplication);
      
      // Check if the referenced job exists
      const job = await Job.findById(sampleApp.jobId);
      console.log("Referenced job exists:", job ? "Yes" : "No");
      if (job) {
        console.log("Job title:", job.title);
      }
      
      // Check if the referenced user exists
      const user = await User.findById(sampleApp.userId);
      console.log("Referenced user exists:", user ? "Yes" : "No");
      if (user) {
        console.log("User email:", user.email);
        console.log("User type:", user.type);
      }
      
      // Check if the referenced recruiter exists
      const recruiter = await Recruiter.findById(sampleApp.recruiterId);
      console.log("Referenced recruiter exists:", recruiter ? "Yes" : "No");
      if (recruiter) {
        console.log("Recruiter name:", recruiter.name);
      }
      
      // Check if the job applicant info exists
      const jobApplicant = await JobApplicant.findOne({ userId: sampleApp.userId });
      console.log("Job applicant info exists:", jobApplicant ? "Yes" : "No");
      if (jobApplicant) {
        console.log("Applicant name:", jobApplicant.name);
      }
      
    } else {
      console.log("No applications found in database");
      
      // Check if there are jobs and users that could create applications
      const jobs = await Job.find({});
      const users = await User.find({});
      const recruiters = await Recruiter.find({});
      
      console.log("Available jobs:", jobs.length);
      console.log("Available users:", users.length);
      console.log("Available recruiters:", recruiters.length);
      
      if (jobs.length > 0 && users.length > 0) {
        console.log("You can create test applications by having users apply for jobs");
      }
    }
    
  } catch (error) {
    console.error("Error checking applications:", error);
  } finally {
    mongoose.connection.close();
  }
}
