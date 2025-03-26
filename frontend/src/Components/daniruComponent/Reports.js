import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ViewTasks from "./ViewTasks";
import StandardNav from "./Nav";
import { jsPDF } from "jspdf"; // Import jsPDF
import "./Report.css";

const URL = "http://localhost:8090/tasks";

const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { tasks: [] };
  }
};

function Task() {
  const [tasks, setTasks] = useState([]);
  const ComponentsRef = useRef();

  useEffect(() => {
    fetchHandler().then((data) => {
      console.log("Fetched tasks:", data.tasks);
      setTasks(data.tasks || []);
    });
  }, []);

  // Function to handle the PDF download
  const handleDownload = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text("Task Report", 20, 20);
    
    // Add tasks to the PDF
    doc.setFontSize(12);
    let yPosition = 30;
    
    tasks.forEach((task, index) => {
      doc.text(`Task ${index + 1}:`, 20, yPosition);
      doc.text(`- Task Name: ${task.taskName}`, 20, yPosition + 10);
      doc.text(`- Description: ${task.taskDescription}`, 20, yPosition + 20);
      doc.text(`- Location: ${task.location}`, 20, yPosition + 30);
      doc.text(`- Start Date: ${new Date(task.startDateTime).toLocaleString()}`, 20, yPosition + 40);
      doc.text(`- End Date: ${new Date(task.endDateTime).toLocaleString()}`, 20, yPosition + 50);
      doc.text(`- Assigned Volunteer: ${task.assignedVolunteer}`, 20, yPosition + 60);
      doc.text(`- Status: ${task.status || "Pending"}`, 20, yPosition + 70);
      doc.text(`- Priority: ${task.priority || "Low"}`, 20, yPosition + 80);
      yPosition += 90; // Adjust for next task

      if (yPosition > 250) { // Check for page overflow
        doc.addPage();
        yPosition = 20;
      }
    });

    // Save the PDF
    doc.save("Task_Report.pdf");
  };

  return (
    <div className="app-container">
      <StandardNav />
      <div className="task-container" ref={ComponentsRef}>
        <h2>Task Report</h2>
        <div className="task-grid">
          {tasks.length > 0 ? (
            tasks.map((task, i) => {
              console.log("Rendering task:", task);
              return <ViewTasks key={i} viewtasks={task} />;
            })
          ) : (
            <p className="no-tasks">No tasks available</p>
          )}
        </div>
        {/* Download Report Button */}
        <button className="download-btn" onClick={handleDownload}>Download Report</button>
      </div>
    </div>
  );
}

export default Task;
