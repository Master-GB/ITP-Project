const Task = require("../../models/daniruModel/TaskModel");

//data display
const getAllTasks = async (req, res, next) => {
  let tasks;
  // Get all users
  try {
    tasks = await Task.find();
  } catch (err) {
    console.log(err);
  }
  // not found
  if (!tasks) {
    return res.status(404).json({ message: "Task not found" });
  }
  // Display all tasks
  return res.status(200).json({ tasks });
};

// data insert
const addTasks = async (req, res, next) => {
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

  let tasks;

  try {
    tasks = new Task({
      taskName,
      taskDescription,
      location,
      startDateTime,
      endDateTime,
      priority,
      assignedVolunteer,
      status: status || "Pending", 
    });
    await tasks.save();
  } catch (err) {
    console.log(err);
  }
  // not insert tasks
  if (!tasks) {
    return res.status(404).json({ message: "unable to add tasks" });
  }
  return res.status(200).json({ tasks });
};

//Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;

  let task;

  try {
    task = await Task.findById(id);
  } catch (err) {
    console.log(err);
  }
  // not available tasks
  if (!task) {
    return res.status(404).json({ message: "Task Not Found" });
  }
  return res.status(200).json({ task });
};

//Update Task Details
const updateTask = async (req, res, next) => {
  const id = req.params.id;
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

  let task;

  try {
    task = await Task.findById(id);
    if (task) {
      task.taskName = taskName;
      task.taskDescription = taskDescription;
      task.location = location;
      task.startDateTime = startDateTime;
      task.endDateTime = endDateTime;
      task.priority = priority;
      task.assignedVolunteer = assignedVolunteer;
      task.status = status;
      await task.save();
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  if (!task) {
    return res.status(404).json({ message: "Unable to Update Task Details" });
  }
  return res.status(200).json({ task });
};

//Delete Task Details
const deleteTask = async (req, res, next) => {
  const id = req.params.id;

  let task;

  try {
    task = await Task.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
  if (!task) {
    return res.status(404).json({ message: "Unable to Delete Task Details" });
  }
  return res.status(200).json({ task });
};

const getTasksByVolunteerName = async (req, res, next) => {
  const { volunteerName } = req.params;

  try {
    if (!volunteerName) {
      return res.status(400).json({ message: "Volunteer name is required" });
    }

    // Ensure Mongoose doesn't treat volunteerName as ObjectId
    const tasks = await Task.find({
      assignedVolunteer: { $regex: `^${volunteerName}$`, $options: "i" }, // Case-insensitive search
    });

    if (tasks.length === 0) {
      return res.status(404).json({ message: `No tasks found for volunteer: ${volunteerName}` });
    }

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTasksByVolunteersName = async (req, res) => {
  const { volunteerName } = req.params;

  try {
    if (!volunteerName) {
      return res.status(400).json({ message: "Volunteer name is required" });
    }

    // Check if volunteer exists
    const volunteer = await Volunteer.findOne({ volunteerName: { $regex: `^${volunteerName}$`, $options: "i" } });

    if (!volunteer) {
      return res.status(404).json({ message: `Volunteer not found: ${volunteerName}` });
    }

    // Fetch tasks assigned to this volunteer
    const tasks = await Task.find({ assignedVolunteer: volunteer._id });

    if (tasks.length === 0) {
      return res.status(404).json({ message: `No tasks found for ${volunteerName}` });
    }

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTasksByVolunteer = async (req, res) => {
  const { volunteerName } = req.params;

  try {
    const tasks = await Task.find({ volunteerName });

    res.json({ volunteerName, tasks: tasks || [] }); // Ensure tasks is always an array
  } catch (error) {
    res.status(500).json({ message: "Server error", tasks: [] });
  }
};

// Controller function to update task status to "ongoing"
const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body; // Assuming status is sent in the request body
  
  if (status !== 'ongoing') {
    return res.status(400).json({ message: 'Invalid status update' });
  }

  try {
    // Find task by ID and update status to "ongoing"
    const task = await Task.findByIdAndUpdate(
      taskId,
      { status: 'ongoing' }, // Set status to "ongoing"
      { new: true } // Return updated document
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Respond with the updated task
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating task status' });
  }
};

exports.getAllTasks = getAllTasks;
exports.addTasks = addTasks;
exports.getById = getById;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
exports.getTasksByVolunteerName = getTasksByVolunteerName;
exports.getTasksByVolunteersName = getTasksByVolunteersName;