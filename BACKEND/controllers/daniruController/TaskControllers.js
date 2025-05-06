const Task = require("../../models/daniruModel/TaskModel");
const Notification = require("../../models/daniruModel/NotificationModel");

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    if (!tasks) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json({ tasks });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Add a new task
const addTasks = async (req, res) => {
  const {
    taskName,
    taskDescription,
    location,
    startDateTime,
    endDateTime,
    priority,
    assignedVolunteer,
    status,
  } = req.body;

  try {
    const task = new Task({
      taskName,
      taskDescription,
      location,
      startDateTime,
      endDateTime,
      priority,
      assignedVolunteer,
      status: status || "Pending",
    });
    await task.save();

    // --- Create a notification for the assigned volunteer ---
    if (assignedVolunteer) {
      await Notification.create({
        user: assignedVolunteer,
        message: `A new task "${taskName}" has been assigned to you.`,
        read: false
      });
    }

    return res.status(200).json({ task });
  } catch (err) {
    return res.status(500).json({ message: "Unable to add task" });
  }
};

// Get task by ID
const getById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task Not Found" });
    return res.status(200).json({ task });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Unable to Update Task Details" });

    Object.assign(task, req.body);
    await task.save();
    return res.status(200).json({ task });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Unable to Delete Task Details" });
    return res.status(200).json({ task });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Get tasks by volunteer name (case-insensitive)
const getTasksByVolunteerName = async (req, res) => {
  const { volunteerName } = req.params;
  try {
    const tasks = await Task.find({
      assignedVolunteer: { $regex: new RegExp(`^${volunteerName}$`, 'i') }
    });
    return res.status(200).json({ tasks });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

// PATCH: Update only the status of a task
const updateTaskStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!["Ongoing", "Completed", "Pending", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    task.status = status;
    await task.save();

    return res.status(200).json({ task });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update task status" });
  }
};

// Get all notifications (no user filter)
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    return res.status(200).json({ notifications });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Mark all notifications as read
const markNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to mark as read" });
  }
};

module.exports = {
  getAllTasks,
  addTasks,
  getById,
  updateTask,
  deleteTask,
  getTasksByVolunteerName,
  updateTaskStatus,
  getNotifications,
  markNotificationsAsRead,
};