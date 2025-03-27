const express = require("express");
const router = express.Router();
//Insert Model
const Task = require("../../models/daniruModel/TaskModel");
//Insert Task Controller
const TaskController = require("../../controllers/daniruController/TaskControllers");

router.get("/", TaskController.getAllTasks);
router.post("/", TaskController.addTasks);
router.get("/:id", TaskController.getById);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);
router.get("/volunteer/:volunteerName", TaskController.getTasksByVolunteerName);
router.get("/tasks/volunteer/:volunteerName", TaskController.getTasksByVolunteerName);
//export
module.exports = router;
