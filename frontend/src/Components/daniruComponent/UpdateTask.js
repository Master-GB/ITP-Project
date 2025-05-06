import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";

function UpdateTask() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:8090/tasks/${id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.task));
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios
      .put(`http://localhost:8090/tasks/${id}`, {
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

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    await sendRequest().then(() => {
      alert("Task Updated Successfully!"); // This is the popup message
      history("/vcl/viewtasks");
    });
  };

  // State to store accepted volunteers
  const [acceptedVolunteers, setAcceptedVolunteers] = useState([]);
  
  // Fetch all volunteers and filter for accepted ones when component mounts
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get("http://localhost:8090/volunteers");
        // Filter for accepted volunteers
        const accepted = response.data.volunteers.filter(
          volunteer => volunteer.status === "Accepted"
        );
        setAcceptedVolunteers(accepted);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };
    
    fetchVolunteers();
  }, []);

  return (
    <div className="create-task-container">
      <Nav />
      <section className="create-task-form-container">
        <h2 className="create-task-heading">Update Task</h2>
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
            {acceptedVolunteers.length > 0 ? (
              acceptedVolunteers.map((volunteer) => (
                <option key={volunteer._id} value={volunteer.volunteerName}>
                  {volunteer.volunteerName}
                </option>
              ))
            ) : (
              <option value="" disabled>No accepted volunteers available</option>
            )}
          </select>

          <button type="submit" className="create-task-button">
            Update Task
          </button>
        </form>
      </section>
    </div>
  );
}

export default UpdateTask;
