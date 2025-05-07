const express = require("express");
const router = express.Router();
const TaskController = require("../../controllers/daniruController/TaskControllers");

router.get("/notifications", TaskController.getNotifications);
router.get("/", TaskController.getAllTasks);
router.post("/", TaskController.addTasks);
router.get("/:id", TaskController.getById);
router.put("/:id", TaskController.updateTask);
router.patch("/:id", TaskController.updateTaskStatus);
router.delete("/:id", TaskController.deleteTask);
router.get("/volunteer/:volunteerName", TaskController.getTasksByVolunteerName);
router.patch("/notifications/mark-read", TaskController.markNotificationsAsRead);

module.exports = router;