const express = require("express");
const router = express.Router();
const volunteerController = require("../../controllers/daniruController/VolunteerController");

// Get all volunteers
router.get("/", volunteerController.getAllVolunteers);

// Check email availability
router.get("/check-email/:email", volunteerController.checkEmailAvailability);

// Check phone availability
router.get("/check-phone/:phone", volunteerController.checkPhoneAvailability);

// Add new volunteer
router.post("/", volunteerController.addVolunteers);

// Update volunteer
router.put("/:id", volunteerController.updateVolunteer);

// Verify code
router.post("/verify", volunteerController.verifyCode);

// Delete volunteer
router.delete("/:id", volunteerController.deleteVolunteer);

// Get volunteer by ID
router.get("/:id", volunteerController.getVolunteerById);

module.exports = router;