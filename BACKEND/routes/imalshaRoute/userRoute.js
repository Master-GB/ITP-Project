const express = require("express");
const router = express.Router();

//inserting the user model
const User = require('../../models/imalshaModel/UserModel');

//inserting the user controller
const userController = require('../../controllers/imalshaController/UserController');

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;