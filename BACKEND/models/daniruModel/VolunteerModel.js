const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VOLUNTEER_ROLES = ["Volunteer Delivery Staff", "Volunteer Packing Staff"];
const VOLUNTEER_STATUS = ["Accepted", "Rejected", "Pending"];

const volunteerSchema = new Schema(
  {
    volunteerName: {
      type: String,
      required: [true, "Volunteer name is required."], 
      trim: true
    },
    contactNumber: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: "Contact number must be exactly 10 digits.",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."],
    },
    role: {
      type: String,
      enum: VOLUNTEER_ROLES,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: VOLUNTEER_STATUS,
      default: "Pending",
    },
    dateApplied: {
      type: Date,
      default: Date.now
    },
    verificationCode: {
      type: String,
      default: null
    }
  }
);

module.exports = mongoose.model("VolunteerModel", volunteerSchema);