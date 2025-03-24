const express=require("express");   
const router=express.Router();

//insert  model
const tracking = require('../../models/sashiniModel/trackingModel');

//insert controller
const trackingController=require('../../controllers/sashiniController/trackingController');


// Define routes
router.get("/",trackingController.getAlltrackings);
router.post("/",trackingController.addtrackings);
router.get("/:trackingId", trackingController.getById);
router.put("/:trackingId", trackingController.updatetracking);
router.delete("/:trackingId", trackingController.deletetracking);

//Export
module.exports = router;