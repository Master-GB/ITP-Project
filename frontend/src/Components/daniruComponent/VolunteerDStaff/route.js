import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";
import "./route.css";
import VolunteerNav from "./VolunteerNav";
import HomeFooter from "../Home/HomeFooter";

const containerStyle = {
  width: "100%",
  height: "80vh",
  margin: "0 auto",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const center = {
  lat: 6.9271,
  lng: 79.8612,
};

const travelModes = [
  { value: "DRIVING", label: "🚗 Driving" },
  { value: "WALKING", label: "🚶 Walking" },
  { value: "TRANSIT", label: "🚌 Public Transport" },
];

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [needyLocations, setNeedyLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          setError("Geolocation error: " + err.message);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  }, []);

  // Fetch needy locations from backend
  useEffect(() => {
    const fetchNeedyLocations = async () => {
      try {
        const res = await axios.get("/api/needy-locations");
        setNeedyLocations(res.data);
      } catch (err) {
        // Fallback to dummy data
        const dummyLocations = [
          {
            name: "Colombo Fort",
            lat: 6.9344,
            lng: 79.8428,
            needyCount: 15,
            foodRequirements: "Rice, Vegetables",
          },
          // ... other locations
        ];
        setNeedyLocations(dummyLocations);
      }
    };
    fetchNeedyLocations();
  }, []);

  const calculateRoute = useCallback(
    async (destination) => {
      if (!currentLocation || !destination || !window.google) return;

      try {
        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
          {
            origin: new window.google.maps.LatLng(
              currentLocation.lat,
              currentLocation.lng
            ),
            destination: new window.google.maps.LatLng(
              destination.lat,
              destination.lng
            ),
            travelMode: window.google.maps.TravelMode[travelMode],
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              setDirections(result);
              setDistance(result.routes[0].legs[0].distance.text);
              setDuration(result.routes[0].legs[0].duration.text);
            } else {
              setError("Failed to calculate route: " + status);
            }
          }
        );
      } catch (err) {
        setError("Error in route calculation: " + err.message);
      }
    },
    [currentLocation, travelMode]
  );

  const findNearestCluster = () => {
    if (!needyLocations.length) return null;

    let maxCount = 0;
    let targetLocation = null;

    for (const location of needyLocations) {
      if (location.needyCount > maxCount) {
        maxCount = location.needyCount;
        targetLocation = location;
      }
    }

    if (targetLocation) {
      calculateRoute(targetLocation);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
        <VolunteerNav/>
        <br/>
        <br/>
        <br/>
        <br/>
      <div className="map-container">
        <h1 className="map-title">Food Delivery Route Optimizer</h1>

        <div className="controls-panel">
          <div className="location-info">
            <h3>Your Location:</h3>
            {currentLocation ? (
              <p>
                {currentLocation.lat.toFixed(4)},{" "}
                {currentLocation.lng.toFixed(4)}
              </p>
            ) : (
              <p>Location not available</p>
            )}
          </div>

          <div className="transport-mode-selector">
            <button
              className="mode-toggle"
              onClick={() => setShowModeSelector(!showModeSelector)}
            >
              {travelModes.find((m) => m.value === travelMode).label}
            </button>

            {showModeSelector && (
              <div className="mode-options">
                {travelModes.map((mode) => (
                  <button
                    key={mode.value}
                    className={`mode-option ${
                      travelMode === mode.value ? "active" : ""
                    }`}
                    onClick={() => {
                      setTravelMode(mode.value);
                      setShowModeSelector(false);
                      if (selectedLocation) calculateRoute(selectedLocation);
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="find-nearest-btn" onClick={findNearestCluster}>
            Find Nearest Cluster
          </button>

          <div className="route-info">
            {distance && (
              <p>
                <strong>Distance:</strong> {distance}
              </p>
            )}
            {duration && (
              <p>
                <strong>Duration:</strong> {duration}
              </p>
            )}
          </div>
        </div>

        <LoadScript
          googleMapsApiKey={
            process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
            "AIzaSyD9KK3Rb0VUF5WEcN6M7VuejWlmvKOqFzo"
          }
          onLoad={() => setMapLoaded(true)}
          onError={(err) => setError("Failed to load Google Maps: " + err)}
        >
          {mapLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={currentLocation || center}
              zoom={12}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {currentLocation && (
                <Marker
                  position={currentLocation}
                  label="You"
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }}
                />
              )}

              {needyLocations.map((location) => (
                <Marker
                  key={`${location.lat}-${location.lng}`}
                  position={{ lat: location.lat, lng: location.lng }}
                  label={`${location.needyCount}`}
                  onClick={() => {
                    setSelectedLocation(location);
                    calculateRoute(location);
                  }}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    scaledSize: new window.google.maps.Size(30, 30),
                  }}
                />
              ))}

              {selectedLocation && (
                <InfoWindow
                  position={{
                    lat: selectedLocation.lat,
                    lng: selectedLocation.lng,
                  }}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div className="info-window">
                    <h3>{selectedLocation.name}</h3>
                    <p>👥 Needy People: {selectedLocation.needyCount}</p>
                    <p>🍲 Food Needed: {selectedLocation.foodRequirements}</p>
                  </div>
                </InfoWindow>
              )}

              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    polylineOptions: {
                      strokeColor: "#4285F4",
                      strokeWeight: 5,
                      strokeOpacity: 0.8,
                    },
                    suppressMarkers: true,
                  }}
                />
              )}
            </GoogleMap>
          )}
        </LoadScript>

        <div className="needy-list">
          <h3>Needy Locations (Click to Navigate)</h3>
          <ul>
            {needyLocations.map((location) => (
              <li
                key={`${location.lat}-${location.lng}`}
                onClick={() => {
                  setSelectedLocation(location);
                  calculateRoute(location);
                }}
                className={
                  selectedLocation?.name === location.name ? "active" : ""
                }
              >
                <strong>{location.name}</strong> - {location.needyCount} people
                <span className="food-req">{location.foodRequirements}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <HomeFooter/>
      </div>
  );
};

export default Map;

