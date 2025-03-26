const express = require("express");
const router = express.Router();
//Insert Model
const Volunteer = require("../../models/daniruModel/VolunteerModel");
//Insert Volunteer Controller
const VolunteerController = require("../../controllers/daniruController/VolunteerController");

router.get("/", VolunteerController.getAllVolunteers);
router.post("/", VolunteerController.addVolunteers);
router.get("/:id", VolunteerController.getById);
router.put("/:id", VolunteerController.updateVolunteer);
router.delete("/:id", VolunteerController.deleteVolunteer);
//export
module.exports = router;
