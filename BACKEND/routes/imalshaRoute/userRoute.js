const express = require("express");
const router = express.Router();
const userController = require("../../controllers/imalshaController/UserController");
// Apply authentication to all routes
router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.get("/:id", userController.getUserById);
router.put("/:id",  userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/dashboard-stats", userController.getDashboardStats);

module.exports = router;
