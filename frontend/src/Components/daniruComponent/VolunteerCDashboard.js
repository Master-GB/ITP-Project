import Nav from "./Nav";
import "./VolunteerCDashboard.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardViewTask from "./DashboardViewTask";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { useGeolocated } from "react-geolocated";
import { FaTasks, FaUserClock, FaCheckCircle, FaUserCheck } from "react-icons/fa";

// Custom icons
const defaultIcon = L.icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const currentLocationIcon = L.icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "current-location-marker"
});

const URL = "http://localhost:8090/tasks";

// OpenRouteService API key
const ORS_API_KEY = "5b3ce3597851110001cf6248d3c2c5bc109b4af8b6c5dc9eb440e048";

// Function to calculate distance between two coordinates in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Helper function to snap a point to the nearest road using ORS
const snapToNearestRoad = async (lat, lon) => {
  const url = `https://api.openrouteservice.org/v2/nearest/road?api_key=${ORS_API_KEY}&point.lon=${lon}&point.lat=${lat}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not snap to nearest road");
  const data = await response.json();
  if (data && data.features && data.features.length > 0) {
    const [snappedLon, snappedLat] = data.features[0].geometry.coordinates;
    return { lat: snappedLat, lon: snappedLon };
  }
  throw new Error("No road found near this point");
};

function Home() {
  const [tasks, setTasks] = useState([]);
  const [distances, setDistances] = useState({});
  const [ongoingTasks, setOngoingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingApplications, setPendingApplications] = useState(0);
  const [centerPosition, setCenterPosition] = useState([6.9271, 79.8612]); // Default to Colombo
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeError, setRouteError] = useState("");
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });

  const fetchHandler = async () => {
    try {
      const res = await axios.get(URL);
      return res.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return { tasks: [] };
    }
  };

  useEffect(() => {
    if (coords) {
      setCenterPosition([coords.latitude, coords.longitude]);
    }
  }, [coords]);

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

  useEffect(() => {
    fetchHandler().then((data) => {
      console.log("Fetched tasks:", data.tasks);
      setTasks(data.tasks || []);
    });
  }, []);

  // Calculate distances when tasks or location changes
  useEffect(() => {
    if (tasks.length > 0 && coords) {
      const newDistances = {};
      tasks.forEach(task => {
        if (task.location && task.location.latitude && task.location.longitude) {
          newDistances[task._id] = calculateDistance(
            coords.latitude,
            coords.longitude,
            task.location.latitude,
            task.location.longitude
          ).toFixed(2);
        }
      });
      setDistances(newDistances);
    }
  }, [tasks, coords]);

  // Function to geocode an address using Nominatim, restricted to Sri Lanka
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=LK&limit=1&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
      }
      throw new Error("Town not found in Sri Lanka");
    } catch (error) {
      console.error("Geocoding error:", error);
      throw error;
    }
  };

  // Function to calculate route between two points using OpenRouteService
  const calculateRoute = async () => {
    if (!fromLocation || !toLocation) {
      setRouteError("Please enter both town names");
      return;
    }

    try {
      setRouteError("");
      setRouteDistance(null);
      setRouteCoordinates([]);
      setStartMarker(null);
      setEndMarker(null);

      // Geocode both towns (restricted to Sri Lanka)
      const fromCoords = await geocodeAddress(fromLocation);
      const toCoords = await geocodeAddress(toLocation);
      console.log('Geocoded from:', fromCoords, 'Geocoded to:', toCoords);

      // Snap both points to the nearest road
      const snappedFrom = await snapToNearestRoad(fromCoords.lat, fromCoords.lon);
      const snappedTo = await snapToNearestRoad(toCoords.lat, toCoords.lon);
      console.log('Snapped from:', snappedFrom, 'Snapped to:', snappedTo);

      setStartMarker([snappedFrom.lat, snappedFrom.lon]);
      setEndMarker([snappedTo.lat, snappedTo.lon]);
      setCenterPosition([
        (snappedFrom.lat + snappedTo.lat) / 2,
        (snappedFrom.lon + snappedTo.lon) / 2
      ]);

      // Call OpenRouteService Directions API for driving route
      const orsUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}`;
      const body = {
        coordinates: [
          [snappedFrom.lon, snappedFrom.lat],
          [snappedTo.lon, snappedTo.lat]
        ]
      };
      const response = await fetch(orsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('ORS Directions API error:', errorText);
        throw new Error("Route not found: " + errorText);
      }
      const data = await response.json();
      const route = data.features[0];
      const distanceKm = route.properties.summary.distance / 1000;
      setRouteDistance(distanceKm.toFixed(2));
      // Convert coordinates for Polyline (lat, lon order)
      const polylineCoords = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
      setRouteCoordinates(polylineCoords);
    } catch (error) {
      setRouteError("Error: " + error.message);
      setRouteDistance(null);
      setRouteCoordinates([]);
      setStartMarker(null);
      setEndMarker(null);
      console.error('Route calculation error:', error);
    }
  };

  return (
    <div>
    <div className="volunteercdashboard-volunteer-hub">
      <Nav />
      {/* Main Content */}
      <div className="volunteercdashboard-main-content">
        <header className="volunteercdashboard-header">
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', justifyContent: 'center'}}>
            <div>
              <h1 style={{margin: 0}}>Dashboard Overview</h1>
              <p className="volunteercdashboard-welcome-message">Welcome back, Volunteer Coordinator!</p>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <section className="volunteercdashboard-stats">
          <div className="volunteercdashboard-stat-card">
            <FaUserCheck className="stat-icon" />
            <h3>{ongoingTasks}</h3>
            <p className="volunteercdashboard-stat-label">Active Volunteers</p>
          </div>
          <div className="volunteercdashboard-stat-card">
            <FaUserClock className="stat-icon" />
            <h3>{pendingApplications}</h3>
            <p>Pending Applications</p>
            <p className="volunteercdashboard-stat-label">Needs review</p>
          </div>
          <div className="volunteercdashboard-stat-card">
            <FaTasks className="stat-icon" />
            <h3>{ongoingTasks}</h3>
            <p>Ongoing Tasks</p>
          </div>
          <div className="volunteercdashboard-stat-card">
            <FaCheckCircle className="stat-icon" />
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
                const distance = distances[task._id];
                return (
                  <DashboardViewTask 
                    key={i} 
                    dashboardviewtask={task} 
                    distance={distance}
                    currentLocation={coords}
                  />
                );
              })
            ) : (
              <p className="no-tasks">No tasks available</p>
            )}
          </div>
          <div className="volunteercdashboard-create-task-container">
            <Link to="/vcl/createtask">
              <button className="volunteercdashboard-create-task-button">
                Create Task
              </button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="volunteercdashboard-footer">
          {/* Map Section */}
          <section className="volunteercdashboard-map-section">
            <h3 className="volunteercdashboard-section-title">
              Task Locations
            </h3>
            <MapContainer
              center={centerPosition}
              zoom={10}
              style={{ height: "400px", width: "100%", borderRadius: "10px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Current location marker */}
              {coords && (
                <Marker 
                  position={[coords.latitude, coords.longitude]} 
                  icon={currentLocationIcon}
                >
                  <Popup>Your Current Location</Popup>
                </Marker>
              )}
              
              {/* Task markers */}
              {tasks.map((task, index) => (
                task.location && task.location.latitude && task.location.longitude && (
                  <Marker 
                    key={index} 
                    position={[task.location.latitude, task.location.longitude]} 
                    icon={defaultIcon}
                  >
                    <Popup>
                      <div>
                        <strong>{task.name}</strong>
                        <p>{task.description}</p>
                        {coords && (
                          <p>
                            Distance: {calculateDistance(
                              coords.latitude,
                              coords.longitude,
                              task.location.latitude,
                              task.location.longitude
                            ).toFixed(2)} km
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}

              {/* Start and End markers */}
              {startMarker && (
                <Marker 
                  position={startMarker} 
                  icon={defaultIcon}
                >
                  <Popup>Start Location</Popup>
                </Marker>
              )}
              {endMarker && (
                <Marker 
                  position={endMarker} 
                  icon={defaultIcon}
                >
                  <Popup>End Location</Popup>
                </Marker>
              )}

              {/* Route line */}
              {routeCoordinates.length > 0 && (
                <Polyline
                  positions={routeCoordinates}
                  color="blue"
                  weight={3}
                  opacity={0.7}
                />
              )}
            </MapContainer>

            {/* Route calculation form */}
            <div className="route-calculation-form">
              <h4>Calculate Route Between Towns</h4>
              <div className="route-inputs">
                <input
                  type="text"
                  placeholder="From (Enter town name)"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="route-input"
                />
                <input
                  type="text"
                  placeholder="To (Enter town name)"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="route-input"
                />
                <button onClick={calculateRoute} className="route-button">
                  Calculate Route
                </button>
              </div>
              {routeError && <p className="route-error">{routeError}</p>}
              {routeDistance && (
                <div className="route-distance">
                  <p>Distance: {routeDistance} km</p>
                  <p>From Town: {fromLocation}</p>
                  <p>To Town: {toLocation}</p>
                </div>
              )}
            </div>
          </section>
        </footer>
      </div>
    </div>
    </div>
  );
}

export default Home;