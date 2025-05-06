const express = require("express");   
const router = express.Router();

// Import model
const User = require('../../models/imalshaModel/UserModel');

// Import controller
const userController = require('../../controllers/imalshaController/userController');

// User routes
router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

// Export router
module.exports = router;

