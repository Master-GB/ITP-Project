require('dotenv').config();
const Volunteer = require("../../models/daniruModel/VolunteerModel");
const nodemailer = require('nodemailer');

const allowedCodes = [
  "462722", "568903", "675433", "567483", "754678",
  "196875", "546786", "089507", "456889", "467865"
];

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

    // Generate verification code if status is changing to Accepted
    if (status === "Accepted" && previousStatus !== "Accepted") {
      // Pick a code from the allowed list
      const verificationCode = allowedCodes[Math.floor(Math.random() * allowedCodes.length)];
      volunteer.verificationCode = verificationCode;
      
      console.log('Generated verification code:', verificationCode);
      console.log('For volunteer:', volunteer.email);

      let subject = 'Volunteer Application Approved';
      let text = `Dear ${volunteer.volunteerName},\n\nYour application has been approved by the Volunteer Coordinator!\n\nYour verification code is: ${verificationCode}\n\nPlease use this code to complete your registration.\n\nThank you for joining us.\n\nBest regards,\nHodaHitha.lk Team`;

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

      try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        throw emailError;
      }
    } else if (status === "Rejected" && previousStatus !== "Rejected") {
      let subject = 'Volunteer Application Rejected';
      let text = `Dear ${volunteer.volunteerName},\n\nWe regret to inform you that your application has been rejected by the Volunteer Coordinator.\n\nThank you for your interest in joining us.\n\nBest regards,\nHodaHitha.lk Team`;

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

      await transporter.sendMail(mailOptions);
    }

    await volunteer.save();
    return res.status(200).json({ volunteer });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating volunteer" });
  }
};

// Add a new function to verify the code
const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  console.log('Verification attempt:', { email, code });

  try {
    const volunteer = await Volunteer.findOne({ email: email.toLowerCase() });
    
    if (!volunteer) {
      console.log('Volunteer not found:', email);
      return res.status(404).json({ message: "Volunteer not found" });
    }

    console.log('Found volunteer:', {
      email: volunteer.email,
      storedCode: volunteer.verificationCode,
      providedCode: code
    });

    if (!volunteer.verificationCode) {
      console.log('No verification code found for volunteer');
      return res.status(400).json({ message: "No verification code found. Please request a new code." });
    }

    if (volunteer.verificationCode !== code) {
      console.log('Invalid verification code');
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Clear the verification code after successful verification
    volunteer.verificationCode = null;
    await volunteer.save();
    console.log('Verification successful for:', email);

    return res.status(200).json({ 
      message: "Verification successful",
      volunteer: {
        name: volunteer.volunteerName,
        email: volunteer.email,
        role: volunteer.role
      }
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    return res.status(500).json({ message: "Error verifying code" });
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
  checkPhoneAvailability,
  verifyCode
};