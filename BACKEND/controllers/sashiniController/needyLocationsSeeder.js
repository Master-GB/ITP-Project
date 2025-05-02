const NeedyLocation = require('../../models/sashiniModel/NeedyLocation');

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

const seedNeedyLocations = async () => {
  await NeedyLocation.deleteMany({});
  await NeedyLocation.insertMany(dummyLocations);
};

module.exports = { seedNeedyLocations };