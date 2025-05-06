const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  taskName: {
    type: String, //dataType
    required: true, //validate
  },
  taskDescription: {
    type: String, //dataType
    required: true, //validate
  },
  location: {
    type: String, //dataType
    required: true, //validate
  },
  startDateTime: {
    type: String, //dataType
    required: true, //validate
  },
  endDateTime: {
    type: String, //dataType
    required: true, //validate
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"], // Priority levels
  },
  assignedVolunteer: {
    type: String, //dataType
    required: true, //validate
  },
  status: {
    type: String,
    enum: ["Ongoing", "Completed","Pending","Rejected"], // Status values
    default: "Pending",
  },
});

module.exports = mongoose.model(
  "TaskModel", //file name
  taskSchema //function name
);