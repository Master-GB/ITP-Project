
const express = require("express");
const router = express.Router();
const donationCon = require("../../controllers/gihanController/donationController");
const upload = require("../../controllers/gihanController/multerConfig")

    router.post("/add", upload.single("imageOfFoods"),donationCon.addDonation);
    router.get("/display",donationCon.displayDonation);
    router.get("/getID/:id",donationCon.displayByID);
    router.delete("/delete/:id",donationCon.deleteDonation);
    router.put("/update/:id",upload.single("imageOfFoods"),donationCon.updateDonation);

module.exports = router;


