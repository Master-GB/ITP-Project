const express = require("express");
const router = express.Router();
const authController = require('../../controllers/imalshaController/authController');

// Auth routes
router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router; 