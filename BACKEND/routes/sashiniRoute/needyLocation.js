const express = require('express');
const router = express.Router();
const { 
  getAllNeedyLocations, 
  seedData 
} = require('../../controllers/sashiniController/neeyLocationsContraller');

// GET all needy locations
router.get('/', getAllNeedyLocations);

// POST seed dummy data
router.post('/seed', seedData);

module.exports = router;