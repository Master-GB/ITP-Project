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
    const modernColors = {
      status: {
        Pending: '#FFA726',    // Orange
        Ongoing: '#42A5F5',    // Blue
        Completed: '#66BB6A',  // Green
        Rejected: '#EF5350'    // Red
      },
      priority: {
        High: '#EF5350',       // Red
        Medium: '#FFA726',     // Orange
        Low: '#66BB6A'         // Green
      }
    };

    const pieOptions = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1, // This ensures the chart is perfectly circular
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      cutout: '0%',
      radius: '90%'
    };

    if (viewMode === 'status') {
      return {
        labels: statusLabels,
        datasets: [
          {
            label: "Status Distribution",
            data: statusValues,
            backgroundColor: statusLabels.map(label => modernColors.status[label]),
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 15,
            hoverBorderWidth: 3,
            hoverBorderColor: '#ffffff',
            hoverBackgroundColor: statusLabels.map(label => modernColors.status[label]),
          },
        ],
        options: pieOptions
      };
    } else if (viewMode === 'priority') {
      return {
        labels: priorityLabels,
        datasets: [
          {
            label: "Priority Distribution",
            data: priorityValues,
            backgroundColor: priorityLabels.map(label => modernColors.priority[label]),
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 15,
            hoverBorderWidth: 3,
            hoverBorderColor: '#ffffff',
            hoverBackgroundColor: priorityLabels.map(label => modernColors.priority[label]),
          },
        ],
        options: pieOptions
      };
    } else {
      return {
        labels: [...statusLabels, ...priorityLabels],
        datasets: [
          {
            label: "Task Distribution",
            data: [...statusValues, ...priorityValues],
            backgroundColor: [
              ...statusLabels.map(label => modernColors.status[label]),
              ...priorityLabels.map(label => modernColors.priority[label])
            ],
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 15,
            hoverBorderWidth: 3,
            hoverBorderColor: '#ffffff',
          },
        ],
        options: pieOptions
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
    
    // Add modern header with gradient background
    doc.setFillColor(26, 188, 156); // Modern teal color
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add title with modern typography
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text("Task Report", 105, 25, { align: "center" });
    
    // Add date with modern styling
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 35, { align: "center" });
    
    // Reset text color for content
    doc.setTextColor(44, 62, 80);
    
    // Add summary statistics with modern card-like design
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(10, 50, 190, 60, 3, 3, 'F');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Summary Statistics", 20, 65);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Tasks: ${tasks.length}`, 20, 80);
    
    // Status summary with modern styling
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Status Distribution:", 20, 95);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    let yPos = 105;
    statusLabels.forEach((status, index) => {
      const percentage = Math.round(statusValues[index] / tasks.length * 100);
      doc.text(`${status}: ${statusValues[index]} (${percentage}%)`, 30, yPos);
      // Add colored dot
      doc.setFillColor(status === 'Pending' ? '#FFA726' : 
                      status === 'Ongoing' ? '#42A5F5' : 
                      status === 'Completed' ? '#66BB6A' : '#EF5350');
      doc.circle(25, yPos - 2, 2, 'F');
      yPos += 10;
    });
    
    // Priority summary with modern styling
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Priority Distribution:", 20, yPos + 10);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPos += 20;
    priorityLabels.forEach((priority, index) => {
      const percentage = Math.round(priorityValues[index] / tasks.length * 100);
      doc.text(`${priority}: ${priorityValues[index]} (${percentage}%)`, 30, yPos);
      // Add colored dot
      doc.setFillColor(priority === 'High' ? '#EF5350' : 
                      priority === 'Medium' ? '#FFA726' : '#66BB6A');
      doc.circle(25, yPos - 2, 2, 'F');
      yPos += 10;
    });

    // Add charts with modern styling
    doc.addPage();
    doc.setFillColor(26, 188, 156);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text("Task Distribution Charts", 105, 20, { align: "center" });
    doc.setTextColor(44, 62, 80);

    // Get chart elements
    const barChart = document.querySelector('.chart-container:nth-child(1) canvas');
    const pieChart = document.querySelector('.chart-container:nth-child(2) canvas');
    const lineChart = document.querySelector('.chart-container:nth-child(3) canvas');

    // Convert charts to images and add to PDF with modern styling
    if (barChart) {
      const barImage = barChart.toDataURL('image/png');
      doc.addImage(barImage, 'PNG', 15, 40, 180, 120);
    }

    if (pieChart) {
      const pieImage = pieChart.toDataURL('image/png');
      doc.addPage();
      doc.setFillColor(26, 188, 156);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("Task Distribution Pie Chart", 105, 20, { align: "center" });
      doc.setTextColor(44, 62, 80);
      doc.addImage(pieImage, 'PNG', 15, 40, 180, 120);
    }

    if (lineChart) {
      const lineImage = lineChart.toDataURL('image/png');
      doc.addPage();
      doc.setFillColor(26, 188, 156);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("Task Distribution Line Chart", 105, 20, { align: "center" });
      doc.setTextColor(44, 62, 80);
      doc.addImage(lineImage, 'PNG', 15, 40, 180, 120);
    }
    
    // Add task details in modern table format
    doc.addPage();
    doc.setFillColor(26, 188, 156);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text("Task Details", 105, 20, { align: "center" });
    doc.setTextColor(44, 62, 80);
    
    // Table headers with modern styling and better alignment
    const headers = ["Task Name", "Description", "Location", "Start Date", "End Date", "Volunteer", "Status", "Priority"];
    // Adjusted column widths to fit PDF page width (210mm)
    const columnWidths = [32, 42, 22, 22, 22, 22, 18, 18];
    const startX = 10;
    const cellPadding = 3; // Reduced padding to fit content better
    const pageWidth = 190; // Total width of the table (210mm - 20mm margins)
    
    // Set font for table
    doc.setFontSize(9); // Slightly smaller font size
    doc.setFont('helvetica', 'bold');
    
    // Draw table headers with modern styling
    let xPos = startX;
    doc.setFillColor(245, 247, 250);
    doc.rect(startX, 35, pageWidth, 10, 'F');
    headers.forEach((header, index) => {
      // Center align the text in each column
      const columnCenter = xPos + (columnWidths[index] / 2);
      doc.text(header, columnCenter, 41, { align: 'center' });
      xPos += columnWidths[index];
    });
    
    // Draw horizontal line under headers
    doc.setDrawColor(26, 188, 156);
    doc.line(startX, 45, startX + pageWidth, 45);
    
    // Add task data to table with modern styling
    doc.setFont('helvetica', 'normal');
    let rowY = 52; // Start rows closer to header
    tasks.forEach((task, index) => {
      // Check if we need a new page
      if (rowY > 270) {
        doc.addPage();
        doc.setFillColor(26, 188, 156);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text("Task Details (Continued)", 105, 20, { align: "center" });
        doc.setTextColor(44, 62, 80);
        
        // Draw table headers again on new page
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        xPos = startX;
        doc.setFillColor(245, 247, 250);
        doc.rect(startX, 35, pageWidth, 10, 'F');
        headers.forEach((header, index) => {
          doc.text(header, xPos + cellPadding, 41);
          xPos += columnWidths[index];
        });
        doc.setDrawColor(26, 188, 156);
        doc.line(startX, 45, startX + pageWidth, 45);
        rowY = 52;
      }
      
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
      } else {
        doc.setFillColor(245, 247, 250);
      }
      doc.rect(startX, rowY - 5, pageWidth, 8, 'F'); // Reduced row height
      
      // Task data
      xPos = startX;
      
      // Task Name (truncate if too long)
      const taskName = task.taskName.length > 12 ? task.taskName.substring(0, 12) + "..." : task.taskName;
      doc.text(taskName, xPos + cellPadding, rowY);
      xPos += columnWidths[0];
      
      // Description (truncate if too long)
      const description = task.taskDescription.length > 18 ? task.taskDescription.substring(0, 18) + "..." : task.taskDescription;
      doc.text(description, xPos + cellPadding, rowY);
      xPos += columnWidths[1];
      
      // Location (truncate if too long)
      const location = task.location.length > 10 ? task.location.substring(0, 10) + "..." : task.location;
      doc.text(location, xPos + cellPadding, rowY);
      xPos += columnWidths[2];
      
      // Start Date (format to be more compact)
      const startDate = new Date(task.startDateTime).toLocaleDateString();
      doc.text(startDate, xPos + cellPadding, rowY);
      xPos += columnWidths[3];
      
      // End Date (format to be more compact)
      const endDate = new Date(task.endDateTime).toLocaleDateString();
      doc.text(endDate, xPos + cellPadding, rowY);
      xPos += columnWidths[4];
      
      // Assigned Volunteer (truncate if too long)
      const volunteer = task.assignedVolunteer.length > 10 ? task.assignedVolunteer.substring(0, 10) + "..." : task.assignedVolunteer;
      doc.text(volunteer, xPos + cellPadding, rowY);
      xPos += columnWidths[5];
      
      // Status with color
      const status = task.status || "Pending";
      doc.setTextColor(
        status === 'Pending' ? '#FFA726' :
        status === 'Ongoing' ? '#42A5F5' :
        status === 'Completed' ? '#66BB6A' : '#EF5350'
      );
      doc.text(status, xPos + cellPadding, rowY);
      xPos += columnWidths[6];
      
      // Priority with color
      const priority = task.priority || "Low";
      doc.setTextColor(
        priority === 'High' ? '#EF5350' :
        priority === 'Medium' ? '#FFA726' : '#66BB6A'
      );
      doc.text(priority, xPos + cellPadding, rowY);
      
      // Reset text color
      doc.setTextColor(44, 62, 80);
      
      // Move to next row
      rowY += 8; // Reduced row spacing
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
            <div className="chart-container" style={{ 
              height: '400px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <h3><FaChartPie style={{marginRight:6}}/>Pie Chart</h3>
              <div style={{ 
                flex: 1, 
                width: '100%', 
                maxWidth: '400px', 
                aspectRatio: '1',
                position: 'relative',
                margin: '0 auto'
              }}>
                <Pie data={getPieData()} options={getPieData().options} />
              </div>
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
