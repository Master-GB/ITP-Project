import Nav from "./Nav";
import "./VolunteerCDashboard.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardViewTask from "./DashboardViewTask";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Default marker icon fix for Leaflet with Webpack
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

const defaultIcon = L.icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

function Home() {
  const [ongoingTasks, setOngoingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingApplications, setPendingApplications] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8090/tasks");
        const tasks = response.data.tasks;

        const ongoing = tasks.filter(
          (task) => task.status === "Ongoing"
        ).length;
        const completed = tasks.filter(
          (task) => task.status === "Completed"
        ).length;

        setOngoingTasks(ongoing);
        setCompletedTasks(completed);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchPendingApplications = async () => {
      try {
        const response = await axios.get("http://localhost:8090/volunteers");
        const volunteers = response.data.volunteers;

        const pendingCount = volunteers.filter(
          (volunteer) => volunteer.status === "Pending"
        ).length;
        setPendingApplications(pendingCount);
      } catch (error) {
        console.error("Error fetching pending applications:", error);
      }
    };

    fetchTasks();
    fetchPendingApplications();
  }, []);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => {
      console.log("Fetched tasks:", data.tasks);
      setTasks(data.tasks || []);
    });
  }, []);

  // Dummy location data (you can dynamically update this)
  const defaultPosition = [7.8731, 80.7718]; // Sri Lanka center

  return (
    <div className="volunteercdashboard-volunteer-hub">
      <Nav />
      {/* Main Content */}
      <div className="volunteercdashboard-main-content">
        <header className="volunteercdashboard-header">
          <h1>Dashboard Overview</h1>
          <p className="volunteercdashboard-welcome-message">Welcome back!</p>
        </header>

        {/* Stats Section */}
        <section className="volunteercdashboard-stats">
          <div className="volunteercdashboard-stat-card">
            <h3>{ongoingTasks}</h3>
            <p className="volunteercdashboard-stat-label">Active Volunteers</p>
          </div>
          <div className="volunteercdashboard-stat-card">
            <h3>{pendingApplications}</h3>
            <p>Pending Applications</p>
            <p className="volunteercdashboard-stat-label">Needs review</p>
          </div>
          <div className="volunteercdashboard-stat-card">
            <h3>{ongoingTasks}</h3>
            <p>Ongoing Tasks</p>
          </div>
          <div className="volunteercdashboard-stat-card">
            <h3>{completedTasks}</h3>
            <p>Completed Tasks</p>
          </div>
        </section>

        {/* Active Tasks Section */}
        <section className="volunteercdashboard-active-tasks">
          <h3 className="volunteercdashboard-section-title">Active Tasks</h3>
          <div className="task-grid">
            {tasks.length > 0 ? (
              tasks.map((task, i) => {
                console.log("Rendering task:", task);
                return <DashboardViewTask key={i} dashboardviewtask={task} />;
              })
            ) : (
              <p className="no-tasks">No tasks available</p>
            )}
          </div>
          <div className="volunteercdashboard-create-task-container">
            <Link to="/createtask">
              <button className="volunteercdashboard-create-task-button">
                Create Task
              </button>
            </Link>
          </div>
        </section>

        {/* Recent Updates Section */}
        {/*<section className="volunteercdashboard-recent-updates">
          <h3 className="volunteercdashboard-section-title">Recent Updates</h3>
          <ul>
            <li className="volunteercdashboard-update-card">
              <strong>New volunteer application from John Smith</strong>
              <span>2 minutes ago</span>
            </li>
            <li className="volunteercdashboard-update-card">
              <strong>Task 'Food Delivery - North' completed</strong>
              <span>15 minutes ago</span>
            </li>
            <li className="volunteercdashboard-update-card">
              <strong>Delivery delay reported in South region</strong>
              <span>1 hour ago</span>
            </li>
          </ul>
        </section>*/}

        {/* Footer */}
        <footer className="volunteercdashboard-footer">
          {/* Map Section */}
          <section className="volunteercdashboard-map-section">
            <h3 className="volunteercdashboard-section-title">
              Task Locations
            </h3>
            <MapContainer
              center={defaultPosition}
              zoom={7}
              style={{ height: "400px", width: "100%", borderRadius: "10px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={defaultPosition} icon={defaultIcon}>
                <Popup>Ongoing Task Location</Popup>
              </Marker>
            </MapContainer>
          </section>
        </footer>
      </div>
    </div>
  );
}

export default Home;
