const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");
const crypto = require("crypto");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const PasswordReset = require("../db/PasswordReset");

const router = express.Router();

router.post("/signup", (req, res) => {
  console.log("Signup request received:", req.body);
  const data = req.body;
  
  // Validate required fields
  if (!data.email || !data.password || !data.type || !data.name) {
    console.log("Missing required fields");
    return res.status(400).json({
      message: "Missing required fields: email, password, type, name",
    });
  }
  
  let user = new User({
    email: data.email,
    password: data.password,
    type: data.type,
  });

  user
    .save()
    .then(() => {
      const userDetails =
        user.type == "recruiter"
          ? new Recruiter({
              userId: user._id,
              name: data.name,
              contactNumber: data.contactNumber,
              bio: data.bio,
              resume: data.resume,
              profile: data.profile,
            })
          : new JobApplicant({
              userId: user._id,
              name: data.name,
              education: data.education,
              skills: data.skills,
              rating: data.rating,
              resume: data.resume,
              profile: data.profile,
            });

      userDetails
        .save()
        .then(() => {
          console.log("User details saved successfully");
          // Token
          const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
          res.json({
            token: token,
            type: user.type,
          });
        })
        .catch((err) => {
          console.log("Error saving user details:", err);
          user
            .delete()
            .then(() => {
              res.status(400).json(err);
            })
            .catch((err) => {
              res.json({ error: err });
            });
          err;
        });
    })
    .catch((err) => {
      console.log("Error saving user:", err);
      res.status(400).json(err);
    });
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json(info);
        return;
      }
      // Token
      const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
      res.json({
        token: token,
        type: user.type,
      });
    }
  )(req, res, next);
});

// Forgot password route
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now()  // 1 hour from now
    
    // Save token to database
    await PasswordReset.findOneAndDelete({ userId: user._id }); // Remove any existing tokens
    
    const passwordReset = new PasswordReset({
      userId: user._id,
      resetToken,
      expiry: resetTokenExpiry,
    });
    
    await passwordReset.save();
    
    // In a real application, send an email with the reset link
    // For this demo, we'll just return the token
    res.status(200).json({
      message: "Password reset link has been sent to your email",
      // For development purposes only, remove in production
      resetToken,
      resetLink: `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Reset password route
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }
    
    // Find valid reset token
    const passwordReset = await PasswordReset.findOne({
      resetToken: token,
      expiry: { $gt: Date.now() },
    });
    
    if (!passwordReset) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }
    
    // Update user password
    const user = await User.findById(passwordReset.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.password = newPassword;
    await user.save();
    
    // Delete the used token
    await PasswordReset.findByIdAndDelete(passwordReset._id);
    
    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
