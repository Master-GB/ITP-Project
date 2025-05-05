import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import StandardNav from "./Nav";
import { jsPDF } from "jspdf";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Report.css";
import { FaChartBar, FaDownload, FaSlidersH, FaFilter, FaChartPie, FaChartBar as FaBar, FaChartLine } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

function Report() {
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'status', or 'priority'
  const ComponentsRef = useRef();

  useEffect(() => {
    fetchHandler().then((data) => {
      setTasks(data.tasks || []);
    });
  }, []);

  // Analyze status counts
  const statusCounts = {
    Pending: 0,
    Ongoing: 0,
    Completed: 0,
    Rejected: 0,
  };

  // Analyze priority counts
  const priorityCounts = {
    High: 0,
    Medium: 0,
    Low: 0,
  };

  tasks.forEach((task) => {
    // Status analysis
    if (statusCounts[task.status]) {
      statusCounts[task.status]++;
    } else if (task.status === "Completed" || task.status === "Approved") {
      statusCounts.Completed++;
    } else if (task.status === "Rejected") {
      statusCounts.Rejected++;
    } else if (task.status === "Ongoing") {
      statusCounts.Ongoing++;
    } else {
      statusCounts.Pending++;
    }

    // Priority analysis
    const priority = task.priority || "Low";
    priorityCounts[priority]++;
  });

  // Status Chart Data
  const statusLabels = ["Pending", "Ongoing", "Completed", "Rejected"];
  const statusValues = [
    statusCounts.Pending,
    statusCounts.Ongoing,
    statusCounts.Completed,
    statusCounts.Rejected,
  ];

  // Priority Chart Data
  const priorityLabels = ["High", "Medium", "Low"];
  const priorityValues = [
    priorityCounts.High,
    priorityCounts.Medium,
    priorityCounts.Low,
  ];

  // Create chart data based on view mode
  const getBarData = () => {
    if (viewMode === 'status') {
      return {
        labels: statusLabels,
        datasets: [
          {
            label: "Status Distribution",
            data: statusValues,
            backgroundColor: [
              "#f39c12",
              "#3498db",
              "#2ecc71",
              "#e74c3c"
            ],
          }
        ],
      };
    } else if (viewMode === 'priority') {
      return {
        labels: priorityLabels,
        datasets: [
          {
            label: "Priority Distribution",
            data: priorityValues,
            backgroundColor: [
              "#e74c3c",
              "#f39c12",
              "#2ecc71"
            ],
          }
        ],
      };
    } else {
      return {
        labels: [...statusLabels, ...priorityLabels],
        datasets: [
          {
            label: "Status Distribution",
            data: [...statusValues, ...Array(priorityLabels.length).fill(0)],
            backgroundColor: [
              "#f39c12",
              "#3498db",
              "#2ecc71",
              "#e74c3c",
              "#ffffff",
              "#ffffff",
              "#ffffff"
            ],
          },
          {
            label: "Priority Distribution",
            data: [...Array(statusLabels.length).fill(0), ...priorityValues],
            backgroundColor: [
              "#ffffff",
              "#ffffff",
              "#ffffff",
              "#ffffff",
              "#e74c3c",
              "#f39c12",
              "#2ecc71"
            ],
          }
        ],
      };
    }
  };
  
  const getPieData = () => {
    if (viewMode === 'status') {
      return {
        labels: statusLabels,
        datasets: [
          {
            label: "Status Distribution",
            data: statusValues,
            backgroundColor: [
              "#f39c12",
              "#3498db",
              "#2ecc71",
              "#e74c3c"
            ],
            borderWidth: 1,
          },
        ],
      };
    } else if (viewMode === 'priority') {
      return {
        labels: priorityLabels,
        datasets: [
          {
            label: "Priority Distribution",
            data: priorityValues,
            backgroundColor: [
              "#e74c3c",
              "#f39c12",
              "#2ecc71"
            ],
            borderWidth: 1,
          },
        ],
      };
    } else {
      return {
        labels: [...statusLabels, ...priorityLabels],
        datasets: [
          {
            label: "Task Distribution",
            data: [...statusValues, ...priorityValues],
            backgroundColor: [
              "#f39c12",
              "#3498db",
              "#2ecc71",
              "#e74c3c",
              "#e74c3c",
              "#f39c12",
              "#2ecc71"
            ],
            borderWidth: 1,
          },
        ],
      };
    }
  };

  const getLineData = () => {
    if (viewMode === 'status') {
      return {
        labels: statusLabels,
        datasets: [
          {
            label: "Status Distribution",
            data: statusValues,
            fill: false,
            borderColor: "#3498db",
            backgroundColor: "#3498db",
            tension: 0.2,
          }
        ],
      };
    } else if (viewMode === 'priority') {
      return {
        labels: priorityLabels,
        datasets: [
          {
            label: "Priority Distribution",
            data: priorityValues,
            fill: false,
            borderColor: "#e74c3c",
            backgroundColor: "#e74c3c",
            tension: 0.2,
          }
        ],
      };
    } else {
      return {
        labels: [...statusLabels, ...priorityLabels],
        datasets: [
          {
            label: "Status Distribution",
            data: [...statusValues, ...Array(priorityLabels.length).fill(0)],
            fill: false,
            borderColor: "#3498db",
            backgroundColor: "#3498db",
            tension: 0.2,
          },
          {
            label: "Priority Distribution",
            data: [...Array(statusLabels.length).fill(0), ...priorityValues],
            fill: false,
            borderColor: "#e74c3c",
            backgroundColor: "#e74c3c",
            tension: 0.2,
          }
        ],
      };
    }
  };

  // Function to handle the PDF download
  const handleDownload = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Task Report", 105, 20, { align: "center" });
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: "center" });
    
    // Add summary statistics
    doc.setFontSize(16);
    doc.text("Summary Statistics", 20, 45);
    
    doc.setFontSize(12);
    doc.text(`Total Tasks: ${tasks.length}`, 20, 55);
    
    // Status summary
    doc.setFontSize(14);
    doc.text("Status Distribution:", 20, 70);
    doc.setFontSize(12);
    let yPos = 80;
    statusLabels.forEach((status, index) => {
      doc.text(`${status}: ${statusValues[index]} (${Math.round(statusValues[index] / tasks.length * 100)}%)`, 30, yPos);
      yPos += 10;
    });
    
    // Priority summary
    doc.setFontSize(14);
    doc.text("Priority Distribution:", 20, yPos + 10);
    doc.setFontSize(12);
    yPos += 20;
    priorityLabels.forEach((priority, index) => {
      doc.text(`${priority}: ${priorityValues[index]} (${Math.round(priorityValues[index] / tasks.length * 100)}%)`, 30, yPos);
      yPos += 10;
    });

    // Add charts
    doc.addPage();
    doc.setFontSize(16);
    doc.text("Task Distribution Charts", 105, 20, { align: "center" });

    // Get chart elements
    const barChart = document.querySelector('.chart-container:nth-child(1) canvas');
    const pieChart = document.querySelector('.chart-container:nth-child(2) canvas');
    const lineChart = document.querySelector('.chart-container:nth-child(3) canvas');

    // Convert charts to images and add to PDF
    if (barChart) {
      const barImage = barChart.toDataURL('image/png');
      doc.addImage(barImage, 'PNG', 20, 30, 170, 100);
    }

    if (pieChart) {
      const pieImage = pieChart.toDataURL('image/png');
      doc.addPage();
      doc.addImage(pieImage, 'PNG', 20, 30, 170, 100);
    }

    if (lineChart) {
      const lineImage = lineChart.toDataURL('image/png');
      doc.addPage();
      doc.addImage(lineImage, 'PNG', 20, 30, 170, 100);
    }
    
    // Add task details in table format
    doc.addPage();
    doc.setFontSize(16);
    doc.text("Task Details", 105, 20, { align: "center" });
    
    // Table headers
    const headers = ["Task Name", "Description", "Location", "Start Date", "End Date", "Volunteer", "Status", "Priority"];
    const columnWidths = [30, 40, 25, 25, 25, 25, 20, 20];
    
    // Set font size for table
    doc.setFontSize(10);
    
    // Draw table headers
    let xPos = 10;
    headers.forEach((header, index) => {
      doc.text(header, xPos, 30);
      xPos += columnWidths[index];
    });
    
    // Draw horizontal line under headers
    doc.line(10, 32, 190, 32);
    
    // Add task data to table
    let rowY = 40;
    tasks.forEach((task, index) => {
      // Check if we need a new page
      if (rowY > 270) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text("Task Details (Continued)", 105, 20, { align: "center" });
        
        // Draw table headers again on new page
        doc.setFontSize(10);
        xPos = 10;
        headers.forEach((header, index) => {
          doc.text(header, xPos, 30);
          xPos += columnWidths[index];
        });
        doc.line(10, 32, 190, 32);
        rowY = 40;
      }
      
      // Task data
      xPos = 10;
      
      // Task Name (truncate if too long)
      const taskName = task.taskName.length > 15 ? task.taskName.substring(0, 15) + "..." : task.taskName;
      doc.text(taskName, xPos, rowY);
      xPos += columnWidths[0];
      
      // Description (truncate if too long)
      const description = task.taskDescription.length > 20 ? task.taskDescription.substring(0, 20) + "..." : task.taskDescription;
      doc.text(description, xPos, rowY);
      xPos += columnWidths[1];
      
      // Location (truncate if too long)
      const location = task.location.length > 12 ? task.location.substring(0, 12) + "..." : task.location;
      doc.text(location, xPos, rowY);
      xPos += columnWidths[2];
      
      // Start Date (format to be more compact)
      const startDate = new Date(task.startDateTime).toLocaleDateString();
      doc.text(startDate, xPos, rowY);
      xPos += columnWidths[3];
      
      // End Date (format to be more compact)
      const endDate = new Date(task.endDateTime).toLocaleDateString();
      doc.text(endDate, xPos, rowY);
      xPos += columnWidths[4];
      
      // Assigned Volunteer (truncate if too long)
      const volunteer = task.assignedVolunteer.length > 12 ? task.assignedVolunteer.substring(0, 12) + "..." : task.assignedVolunteer;
      doc.text(volunteer, xPos, rowY);
      xPos += columnWidths[5];
      
      // Status
      doc.text(task.status || "Pending", xPos, rowY);
      xPos += columnWidths[6];
      
      // Priority
      doc.text(task.priority || "Low", xPos, rowY);
      
      // Draw horizontal line between rows
      doc.line(10, rowY + 2, 190, rowY + 2);
      
      // Move to next row
      rowY += 10;
    });
    
    // Save the PDF
    doc.save("Task_Report.pdf");
  };

  return (
    <div className="app-root report-bg-gradient">
      <StandardNav className="sidebar" />
      <div className="app-container">
        <div className="task-container report-glass">
          <h2 className="report-heading-modern"><FaChartBar style={{color:'#1abc9c', marginRight:10, verticalAlign:'middle'}}/>Task Reports</h2>
          <div className="view-mode-toggle">
            <button className={`toggle-btn${viewMode === 'all' ? ' active' : ''}`} onClick={() => setViewMode('all')}><FaSlidersH style={{marginRight:6}}/>All</button>
            <button className={`toggle-btn${viewMode === 'status' ? ' active' : ''}`} onClick={() => setViewMode('status')}><FaBar style={{marginRight:6}}/>Status</button>
            <button className={`toggle-btn${viewMode === 'priority' ? ' active' : ''}`} onClick={() => setViewMode('priority')}><FaChartPie style={{marginRight:6}}/>Priority</button>
          </div>
          <div className="filter-section">
            <h3><FaFilter style={{marginRight:6}}/>Filter Tasks</h3>
            <div className="filter-buttons">
              {/* ...existing filter buttons... */}
            </div>
          </div>
          <div className="charts-section">
            <div className="chart-container">
              <h3><FaBar style={{marginRight:6}}/>Bar Chart</h3>
              <Bar data={getBarData()} />
            </div>
            <div className="chart-container">
              <h3><FaChartPie style={{marginRight:6}}/>Pie Chart</h3>
              <Pie data={getPieData()} />
            </div>
            <div className="chart-container">
              <h3><FaChartLine style={{marginRight:6}}/>Line Chart</h3>
              <Line data={getLineData()} />
            </div>
          </div>
          <button className="download-btn report-download-btn" onClick={handleDownload}>
            <FaDownload style={{marginRight:8, verticalAlign:'middle'}}/>Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Report;
