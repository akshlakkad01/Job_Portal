// backend/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const JobApplicant = require('../db/JobApplicant');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = file.fieldname === 'resume' ? './public/resume/' : './public/profile/';
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

router.post("/resume", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  
  const file = req.file;
  const filename = file.filename;
  const relativePath = `/host/resume/${filename}`;
  
  console.log( "Inside  resume upload : "  +  relativePath);
  

  JobApplicant.updateOne(
    { userId: req.user._id }, 
    { $set: { resume: relativePath } },
    { upsert: true }
  )
  .then(result => {
    res.json({ 
      message: "Resume updated successfully",
      url: relativePath
    });
  })
  .catch(err => {
    console.log(err);
    res.status(400).json({ message: "Error updating resume" });
  });
});

router.post("/profile", upload.single("profile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  
  const file = req.file;
  const filename = file.filename;
  const relativePath = `/host/profile/${filename}`;
  
  JobApplicant.updateOne(
    { userId: req.user._id }, 
    { $set: { profile: relativePath } },
    { upsert: true }
  )
  .then(result => {
    res.json({ 
      message: "Profile image updated successfully",
      url: relativePath
    });
  })
  .catch(err => {
    console.log(err);
    res.status(400).json({ message: "Error updating profile image" });
  });
});

module.exports = router;