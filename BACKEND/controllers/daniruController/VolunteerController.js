require('dotenv').config();
const Volunteer = require("../../models/daniruModel/VolunteerModel");
const nodemailer = require('nodemailer');

// Get all volunteers
const getAllVolunteers = async (req, res, next) => {
  let volunteers;
  try {
    volunteers = await Volunteer.find();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  if (!volunteers) {
    return res.status(404).json({ message: "No volunteers found" });
  }
  return res.status(200).json({ volunteers });
};

// Check email availability
const checkEmailAvailability = async (req, res) => {
  try {
    const email = req.params.email;
    const existingVolunteer = await Volunteer.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (existingVolunteer) {
      return res.status(200).json({ 
        exists: true,
        message: "This email is already registered as a volunteer"
      });
    }
    
    return res.status(200).json({ 
      exists: false,
      message: "Email is available"
    });
  } catch (error) {
    console.error("Error checking email availability:", error);
    res.status(500).json({ 
      message: "Error checking email availability",
      error: error.message 
    });
  }
};

// Check phone availability
const checkPhoneAvailability = async (req, res) => {
  try {
    const phone = req.params.phone;
    const existingVolunteer = await Volunteer.findOne({ 
      contactNumber: phone 
    });
    
    if (existingVolunteer) {
      return res.status(200).json({ 
        exists: true,
        message: "This phone number is already registered as a volunteer"
      });
    }
    
    return res.status(200).json({ 
      exists: false,
      message: "Phone number is available"
    });
  } catch (error) {
    console.error("Error checking phone availability:", error);
    res.status(500).json({ 
      message: "Error checking phone availability",
      error: error.message 
    });
  }
};

// Add new volunteer
const addVolunteers = async (req, res, next) => {
  const { volunteerName, contactNumber, email, role, status } = req.body;

  try {
    // Check for existing email
    const existingEmail = await Volunteer.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (existingEmail) {
      return res.status(409).json({ 
        message: "This email is already registered as a volunteer",
        type: "email"
      });
    }

    // Check for existing phone
    const existingPhone = await Volunteer.findOne({ 
      contactNumber: contactNumber 
    });
    
    if (existingPhone) {
      return res.status(409).json({ 
        message: "This phone number is already registered as a volunteer",
        type: "phone"
      });
    }

    // If no duplicates, create new volunteer
    const volunteers = new Volunteer({
      volunteerName,
      contactNumber,
      email: email.toLowerCase(),
      role,
      status: status || "Pending",
      dateApplied: new Date()
    });

    await volunteers.save();
    return res.status(200).json({ volunteers });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ 
      message: "Unable to add volunteer",
      error: err.message 
    });
  }
};

// Update volunteer
const updateVolunteer = async (req, res, next) => {
  const id = req.params.id;
  const { volunteerName, contactNumber, email, role, status } = req.body;

  try {
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    const previousStatus = volunteer.status;

    volunteer.volunteerName = volunteerName || volunteer.volunteerName;
    volunteer.contactNumber = contactNumber || volunteer.contactNumber;
    volunteer.email = email ? email.toLowerCase() : volunteer.email;
    volunteer.role = role || volunteer.role;
    volunteer.status = status || volunteer.status;

    await volunteer.save();

    // Send email if status changed to Accepted or Rejected
    if ((status === "Accepted" && previousStatus !== "Accepted") ||
        (status === "Rejected" && previousStatus !== "Rejected")) {

      let subject, text;

      if (status === "Accepted") {
        subject = 'Volunteer Application Approved';
        text = `Dear ${volunteer.volunteerName},\n\nYour application has been approved by the Volunteer Coordinator!\nNow, you can register to the platform as a volunteer.\n\nThank you for joining us.\n\nBest regards,\nHodaHitha.lk Team`;
      } else if (status === "Rejected") {
        subject = 'Volunteer Application Rejected';
        text = `Dear ${volunteer.volunteerName},\n\nWe regret to inform you that your application has been rejected by the Volunteer Coordinator.\n\nThank you for your interest in joining us.\n\nBest regards,\nHodaHitha.lk Team`;
      }

      let mailOptions = {
        from: `"HodaHitha.lk" <${process.env.EMAIL_USER}>`,
        to: volunteer.email,
        subject: subject,
        text: text
      };

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }

    return res.status(200).json({ volunteer });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating volunteer" });
  }
};

// Delete volunteer
const deleteVolunteer = async (req, res, next) => {
  const id = req.params.id;
  try {
    const volunteer = await Volunteer.findByIdAndRemove(id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    return res.status(200).json({ message: "Volunteer deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error deleting volunteer" });
  }
};

// Get volunteer by ID
const getVolunteerById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    return res.status(200).json({ volunteer });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error finding volunteer" });
  }
};

module.exports = {
  getAllVolunteers,
  addVolunteers,
  updateVolunteer,
  deleteVolunteer,
  getVolunteerById,
  checkEmailAvailability,
  checkPhoneAvailability
};