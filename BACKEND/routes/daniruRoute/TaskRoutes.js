const express = require("express");
const router = express.Router();
const TaskController = require("../../controllers/daniruController/TaskControllers");

router.get("/", TaskController.getAllTasks);
router.post("/", TaskController.addTasks);
router.get("/:id", TaskController.getById);
router.put("/:id", TaskController.updateTask);
router.patch("/:id", TaskController.updateTaskStatus);
router.delete("/:id", TaskController.deleteTask);
router.get("/volunteer/:volunteerName", TaskController.getTasksByVolunteerName);

module.exports = router;