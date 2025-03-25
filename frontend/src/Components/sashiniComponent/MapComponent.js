import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import axios from "axios";

const containerStyle = { width: "100%", height: "500px" };
const center = { lat: 6.9271, lng: 79.8612 }; // Default center (Colombo)

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearestNeedy, setNearestNeedy] = useState(null);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  const findNearestNeedyPerson = async () => {
    if (!userLocation) return;

    try {
      const response = await axios.post("http://localhost:8090/find-nearest", { userLocation });
      setNearestNeedy(response.data.nearest);
      getDirections(response.data.nearest);
    } catch (error) {
      console.error("Error finding nearest needy person:", error);
    }
  };

  const getDirections = async (destination) => {
    if (!userLocation || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") setDirections(result);
        else console.error("Error fetching directions:", status);
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyD9KK3Rb0VUF5WEcN6M7VuejWlmvKOqFzo">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {userLocation && <Marker position={userLocation} label="You" />}
        {nearestNeedy && <Marker position={nearestNeedy} label="Nearest Needy Person" />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      <button onClick={findNearestNeedyPerson} style={{ marginTop: "10px" }}>
        Find Nearest Needy Person
      </button>
    </LoadScript>
  );
};

export default MapComponent;
