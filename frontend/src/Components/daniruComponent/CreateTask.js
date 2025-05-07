import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateTask.css";
import Nav from "./Nav";
import { FaPlusCircle, FaCheck } from "react-icons/fa";

function CreateTask() {
  const history = useNavigate();
  
  // Get current date and time in the format required for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  const [inputs, setInputs] = useState({
    taskName: "",
    taskDescription: "",
    location: "",
    startDateTime: getCurrentDateTime(),
    endDateTime: "",
    priority: "",
    assignedVolunteer: "",
  });
  
  // State to track validation errors
  const [errors, setErrors] = useState({});
  
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
  
  // Update end date min attribute when start date changes
  useEffect(() => {
    if (inputs.startDateTime) {
      // Set the min attribute for end date input
      const endDateInput = document.getElementById("endDateTime");
      if (endDateInput) {
        endDateInput.min = inputs.startDateTime;
      }
      
      // If end date is before start date, reset it
      if (inputs.endDateTime && inputs.endDateTime < inputs.startDateTime) {
        setInputs(prev => ({
          ...prev,
          endDateTime: inputs.startDateTime
        }));
      }
    }
  }, [inputs.startDateTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate start date is not in the past
    if (name === "startDateTime") {
      const selectedDate = new Date(value);
      const currentDate = new Date();
      
      if (selectedDate < currentDate) {
        setErrors(prev => ({
          ...prev,
          startDateTime: "Start date cannot be in the past"
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          startDateTime: ""
        }));
      }
    }
    
    // Validate end date is after start date
    if (name === "endDateTime" && inputs.startDateTime && value < inputs.startDateTime) {
      setErrors(prev => ({
        ...prev,
        endDateTime: "End date must be after start date"
      }));
    } else if (name === "endDateTime") {
      setErrors(prev => ({
        ...prev,
        endDateTime: ""
      }));
    }
    
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate start date is not in the past
    const startDate = new Date(inputs.startDateTime);
    const currentDate = new Date();
    
    if (startDate < currentDate) {
      setErrors(prev => ({
        ...prev,
        startDateTime: "Start date cannot be in the past"
      }));
      return; // Don't submit if validation fails
    }
    
    // Validate end date is after start date before submitting
    if (inputs.endDateTime && inputs.startDateTime && inputs.endDateTime < inputs.startDateTime) {
      setErrors(prev => ({
        ...prev,
        endDateTime: "End date must be after start date"
      }));
      return; // Don't submit if validation fails
    }
    
    console.log(inputs);
    await sendRequest();
    history("/vcl/viewtasks");
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
        <h2 className="create-task-heading"><FaPlusCircle style={{color:'#1abc9c', marginRight:'10px', verticalAlign:'middle'}}/>Create a New Task</h2>
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
            id="startDateTime"
            name="startDateTime"
            onChange={handleChange}
            value={inputs.startDateTime}
            min={getCurrentDateTime()}
            required
            className={`create-task-input ${errors.startDateTime ? "error-input" : ""}`}
          />
          {errors.startDateTime && <p className="error-message">{errors.startDateTime}</p>}

          <label className="create-task-label">End Date & Time:</label>
          <input
            type="datetime-local"
            id="endDateTime"
            name="endDateTime"
            onChange={handleChange}
            value={inputs.endDateTime}
            min={inputs.startDateTime}
            required
            className={`create-task-input ${errors.endDateTime ? "error-input" : ""}`}
          />
          {errors.endDateTime && <p className="error-message">{errors.endDateTime}</p>}

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
            <FaCheck style={{marginRight:'8px', verticalAlign:'middle'}}/>Create Task
          </button>
        </form>
      </section>
    </div>
  );
}

export default CreateTask;
