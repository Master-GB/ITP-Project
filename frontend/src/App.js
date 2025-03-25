import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import './App.css';

const containerStyle = {
  width: '100%',
  height: '80vh',
  margin: '0 auto'
};

const center = {
  lat: 6.9271,
  lng: 79.8612
};

function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [needyLocations, setNeedyLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
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
        // In production, use: const res = await axios.get('http://localhost:8090/api/needy-locations');
        // For demo, we'll use hardcoded data:
        const dummyLocations = [
          { name: "Colombo Fort", lat: 6.9344, lng: 79.8428, needyCount: 15, foodRequirements: "Rice, Vegetables" },
          { name: "Pettah", lat: 6.9355, lng: 79.8556, needyCount: 20, foodRequirements: "Bread, Fruits" },
          // ... (same as backend dummy data)
        ];
        setNeedyLocations(dummyLocations);
      } catch (err) {
        setError("Failed to load needy locations");
      }
    };
    fetchNeedyLocations();
  }, []);

  // Calculate route to selected destination
  const calculateRoute = async (destination) => {
    if (!currentLocation || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng),
        destination: new window.google.maps.LatLng(destination.lat, destination.lng),
        travelMode: window.google.maps.TravelMode.DRIVING,
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
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="App">
      <h1>Food Delivery Route Optimizer</h1>
      
      <div className="controls">
        <div className="location-info">
          <h3>Your Location:</h3>
          {currentLocation ? (
            <p>{currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</p>
          ) : (
            <p>Location not available</p>
          )}
        </div>

        <div className="route-info">
          {distance && <p><strong>Distance:</strong> {distance}</p>}
          {duration && <p><strong>Duration:</strong> {duration}</p>}
        </div>
      </div>

      <LoadScript googleMapsApiKey="AIzaSyD9KK3Rb0VUF5WEcN6M7VuejWlmvKOqFzo">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
        >
          {/* Current Location Marker */}
          {currentLocation && (
            <Marker
              position={currentLocation}
              label="You"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
          )}

          {/* Needy Location Markers */}
          {needyLocations.map((location, index) => (
            <Marker
              key={index}
              position={{ lat: location.lat, lng: location.lng }}
              label={`${location.needyCount}`}
              onClick={() => {
                setSelectedLocation(location);
                calculateRoute(location);
              }}
            />
          ))}

          {/* Selected Location Info */}
          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div>
                <h3>{selectedLocation.name}</h3>
                <p>Needy People: {selectedLocation.needyCount}</p>
                <p>Food Needed: {selectedLocation.foodRequirements}</p>
              </div>
            </InfoWindow>
          )}

          {/* Route Directions */}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>

      <div className="needy-list">
        <h3>Needy Locations (Click to Navigate)</h3>
        <ul>
          {needyLocations.map((location, index) => (
            <li key={index} onClick={() => calculateRoute(location)}>
              <strong>{location.name}</strong> - {location.needyCount} people
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;