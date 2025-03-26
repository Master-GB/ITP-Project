const Volunteer = require("../../models/daniruModel/VolunteerModel");

//data display
const getAllVolunteers = async (req, res, next) => {
  let volunteers;
  // Get all volunteers
  try {
    volunteers = await Volunteer.find();
  } catch (err) {
    console.log(err);
  }
  // not found
  if (!volunteers) {
    return res.status(404).json({ message: "Volunteer not found" });
  }
  // Display all volunteers
  return res.status(200).json({ volunteers });
};

// data insert
const addVolunteers = async (req, res, next) => {
  const { volunteerName, contactNumber, email, role, status } = req.body;

  let volunteers;

  try {
    volunteers = new Volunteer({
      volunteerName,
      contactNumber,
      email,
      role,
      status: status || "Pending",
    });
    await volunteers.save();
  } catch (err) {
    console.log(err);
  }
  // not insert volunteers
  if (!volunteers) {
    return res.status(404).json({ message: "unable to add volunteers" });
  }
  return res.status(200).json({ volunteers });
};

//Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;

  let volunteer;

  try {
    volunteer = await Volunteer.findById(id);
  } catch (err) {
    console.log(err);
  }
  // not available volunteers
  if (!volunteer) {
    return res.status(404).json({ message: "Volunteer Not Found" });
  }
  return res.status(200).json({ volunteer });
};

//Update Volunteer Details
const updateVolunteer = async (req, res, next) => {
  const id = req.params.id;
  const { volunteerName, contactNumber, email, role, status } = req.body;

  let volunteer;

  try {
    volunteer = await Volunteer.findById(id);
    if (volunteer) {
        volunteer.volunteerName = volunteerName;
        volunteer.contactNumber = contactNumber;
        volunteer.email = email;
        volunteer.role = role;
        volunteer.status = status;
      await volunteer.save();
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  if (!volunteer) {
    return res.status(404).json({ message: "Unable to Update Volunteer Details" });
  }
  return res.status(200).json({ volunteer });
};

//Delete Volunteer Details
const deleteVolunteer = async (req, res, next) => {
  const id = req.params.id;

  let volunteer;

  try {
    volunteer = await Volunteer.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!volunteer) {
    return res.status(404).json({ message: "Unable to Delete Volunteer Details" });
  }
  return res.status(200).json({ volunteer });
};

exports.getAllVolunteers = getAllVolunteers;
exports.addVolunteers = addVolunteers;
exports.getById = getById;
exports.updateVolunteer = updateVolunteer;
exports.deleteVolunteer = deleteVolunteer;
