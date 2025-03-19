const express = require("express");
const router = express.Router();
const donationCon = require("../../controllers/gihanController/donationController");

    router.post("/add",donationCon.addDonation);

module.exports = router;

