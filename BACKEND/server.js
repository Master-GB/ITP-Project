require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 8090;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const URL = process.env.MONGODB_URL;
mongoose.connect(URL);
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Mongo-DB Connection Successful!");
});

// Needy Location Schema
const needyLocationSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
  needyCount: Number,
  foodRequirements: String
});

const NeedyLocation = mongoose.model('NeedyLocation', needyLocationSchema);

// API Endpoints
// Get all needy locations
app.get('/api/needy-locations', async (req, res) => {
  try {
    const locations = await NeedyLocation.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Seed dummy data (run once)
app.post('/api/seed-data', async (req, res) => {
  const dummyLocations = [
    { name: "Colombo Fort", lat: 6.9344, lng: 79.8428, needyCount: 15, foodRequirements: "Rice, Vegetables" },
    { name: "Pettah", lat: 6.9355, lng: 79.8556, needyCount: 20, foodRequirements: "Bread, Fruits" },
    { name: "Bambalapitiya", lat: 6.8958, lng: 79.8553, needyCount: 10, foodRequirements: "Milk, Biscuits" },
    { name: "Dehiwala", lat: 6.8567, lng: 79.8647, needyCount: 18, foodRequirements: "Rice, Chicken" },
    { name: "Mount Lavinia", lat: 6.8276, lng: 79.8649, needyCount: 12, foodRequirements: "Vegetables, Eggs" },
    { name: "Rajagiriya", lat: 6.9067, lng: 79.8942, needyCount: 8, foodRequirements: "Bread, Jam" },
    { name: "Nugegoda", lat: 6.8636, lng: 79.8897, needyCount: 14, foodRequirements: "Rice, Fish" },
    { name: "Maharagama", lat: 6.8480, lng: 79.9265, needyCount: 16, foodRequirements: "Fruits, Milk" },
    { name: "Kottawa", lat: 6.8409, lng: 79.9656, needyCount: 9, foodRequirements: "Bread, Butter" },
    { name: "Homagama", lat: 6.8408, lng: 80.0132, needyCount: 11, foodRequirements: "Rice, Vegetables" },
    { name: "Kaduwela", lat: 6.9317, lng: 79.9858, needyCount: 7, foodRequirements: "Eggs, Bread" },
    { name: "Malabe", lat: 6.9000, lng: 79.9614, needyCount: 13, foodRequirements: "Rice, Chicken" },
    { name: "Kiribathgoda", lat: 6.9744, lng: 79.9200, needyCount: 10, foodRequirements: "Bread, Fruits" },
    { name: "Kelaniya", lat: 6.9553, lng: 79.9225, needyCount: 6, foodRequirements: "Milk, Biscuits" },
    { name: "Wattala", lat: 6.9897, lng: 79.8917, needyCount: 8, foodRequirements: "Rice, Fish" },
    { name: "Negombo", lat: 7.2096, lng: 79.8367, needyCount: 5, foodRequirements: "Bread, Jam" },
    { name: "Gampaha", lat: 7.0899, lng: 79.9994, needyCount: 9, foodRequirements: "Vegetables, Eggs" },
    { name: "Kandy", lat: 7.2906, lng: 80.6337, needyCount: 4, foodRequirements: "Rice, Chicken" },
    { name: "Galle", lat: 6.0535, lng: 80.2210, needyCount: 3, foodRequirements: "Fruits, Milk" },
    { name: "Matara", lat: 5.9483, lng: 80.5353, needyCount: 2, foodRequirements: "Bread, Butter" }
  ];

  try {
    await NeedyLocation.deleteMany({});
    await NeedyLocation.insertMany(dummyLocations);
    res.json({ message: "Database seeded successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to seed data" });
  }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is up and running on port no ${PORT}`);
});