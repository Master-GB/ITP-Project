const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  FoodCategory: {
    type: String,
    required: true,
  },
  foodItem: {
    type: String,
    required: true,
  },
  storageCondition: {
    type: String,
    required: true,
  },
  collectionAddress: {
    type: String,
    required: true,
  },
  imageOfFoods: {
    type: Buffer,
  },
  notes: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Pending", "Collected", "Delivered"],
    default: "Pending",
  },
  DonationDate: {
    type: Date,
    default: Date.now,
  },
  ExpiryDate: {
    type: Date,
    required: true,
  },
});

const donation = mongoose.model("donations");
