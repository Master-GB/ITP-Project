const NeedyLocation = require('../../models/sashiniModel/NeedyLocation');
const { seedNeedyLocations } = require('./needyLocationsSeeder');

// Get all needy locations
const getAllNeedyLocations = async (req, res) => {
  try {
    const locations = await NeedyLocation.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

// Seed dummy data
const seedData = async (req, res) => {
  try {
    await seedNeedyLocations();
    res.json({ message: "Database seeded successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to seed data" });
  }
};

module.exports = {
  getAllNeedyLocations,
  seedData
};
