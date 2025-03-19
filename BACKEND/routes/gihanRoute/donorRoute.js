const express = require("express");
const router = express.Router();
const donationCon = require("../../controllers/gihanController/donationController");

    router.post("/add",donationCon.addDonation);
    router.get("/display",donationCon.displayDonation);
    router.get("/getID/:id",donationCon.displayByID);
    router.delete("/delete/:id",donationCon.deleteDonation);

module.exports = router;

