const express = require("express");
const router = express.Router();
const donationCon = require("../../controllers/gihanController/donationController");

    router.post("/add",donationCon.addDonation);

    router.get("/display",donationCon.displayDonation);

module.exports = router;

