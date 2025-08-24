// backend/db/JobApplicant.js
const mongoose = require('mongoose');

let schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  education: [
    {
      institutionName: {
        type: String,
        required: true,
      },
      startYear: {
        type: Number,
        min: 1930,
        max: new Date().getFullYear(),
        required: true,
        validate: Number.isInteger,
      },
      endYear: {
        type: Number,
        max: new Date().getFullYear(),
        validate: [
          { validator: Number.isInteger, msg: "Year should be an integer" },
          {
            validator: (value) => value >= this.startYear,
            msg: "End year should be greater than or equal to Start year",
          },
        ],
      },
    },
  ],
  skills: [String],
  rating: {
    type: Number,
    max: 5.0,
    default: -1.0,
    validate: {
      validator: Number.isInteger,
      msg: "Rating should be an integer",
    },
  },
  resume: {
    type: String,
  },
  profile: {
    type: String,
  },
}, { collation: { locale: "en" } });

module.exports = mongoose.model("JobApplicantInfo", schema);