const mongoose = require('mongoose');

const needyLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  needyCount: {
    type: Number,
    required: true
  },
  foodRequirements: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('NeedyLocation', needyLocationSchema);