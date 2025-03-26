import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateTask.css";
import Nav from "./Nav";

function CreateTask() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    taskName: "",
    taskDescription: "",
    location: "",
    startDateTime: "",
    endDateTime: "",
    priority: "",
    assignedVolunteer: "",
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    await sendRequest();
    history("/viewtasks");
  };

  const sendRequest = async () => {
    await axios
      .post("http://localhost:8090/tasks", {
        taskName: String(inputs.taskName),
        taskDescription: String(inputs.taskDescription),
        location: String(inputs.location),
        startDateTime: String(inputs.startDateTime),
        endDateTime: String(inputs.endDateTime),
        priority: String(inputs.priority),
        assignedVolunteer: String(inputs.assignedVolunteer),
      })
      .then((res) => res.data);
  };

  return (
    <div className="create-task-container">
      <Nav />
      <section className="create-task-form-container">
        <h2 className="create-task-heading">Create a New Task</h2>
        <form onSubmit={handleSubmit} className="create-task-form">
          <label className="create-task-label">Task Name:</label>
          <input
            type="text"
            name="taskName"
            onChange={handleChange}
            value={inputs.taskName}
            required
            className="create-task-input"
          />

          <label className="create-task-label">Task Description:</label>
          <input
            type="text"
            name="taskDescription"
            onChange={handleChange}
            value={inputs.taskDescription}
            required
            className="create-task-input"
          />

          <label className="create-task-label">Location:</label>
          <input
            type="text"
            name="location"
            onChange={handleChange}
            value={inputs.location}
            required
            className="create-task-input"
          />

          <label className="create-task-label">Start Date & Time:</label>
          <input
            type="datetime-local"
            name="startDateTime"
            onChange={handleChange}
            value={inputs.startDateTime}
            required
            className="create-task-input"
          />

          <label className="create-task-label">End Date & Time:</label>
          <input
            type="datetime-local"
            name="endDateTime"
            onChange={handleChange}
            value={inputs.endDateTime}
            required
            className="create-task-input"
          />

          <label className="create-task-label">Priority:</label>
          <select
            name="priority"
            onChange={handleChange}
            value={inputs.priority}
            required
            className="create-task-select"
          >
            <option value="">-- Choose --</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <label className="create-task-label">Assigned Volunteer:</label>
          <select
            name="assignedVolunteer"
            onChange={handleChange}
            value={inputs.assignedVolunteer}
            required
            className="create-task-select"
          >
            <option value="">-- Choose --</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
          </select>

          <button type="submit" className="create-task-button">
            Create Task
          </button>
        </form>
      </section>
    </div>
  );
}

export default CreateTask;
