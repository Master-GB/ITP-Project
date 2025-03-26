const express = require("express");

//insert model
const router = express.Router();
const FoodRequestController = require("../../controllers/malshiController/FoodRequestController");


// Define routes
router.get("/", FoodRequestController.getAllRequests);
router.post("/", FoodRequestController.addRequests);
router.get("/:requestId", FoodRequestController.getById);
router.put("/:requestId", FoodRequestController.updateRequest);
router.delete("/:requestId", FoodRequestController.deleteRequest);

//Export
module.exports = router;
