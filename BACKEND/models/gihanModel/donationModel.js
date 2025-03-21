const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  foodCategory: {
    type: String,
    required: [true, "Food category is required"],
  },
  foodItem: {
    type: String,
    required: [true, "Food item is required"],
  },
  storageCondition: {
    type: String,
    required: [true, "Storage Condition is required"],
  },
  donationDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    required: [true, "Expiry date is required"],
    validate: {
      validator: function (value) {
        return value > this.donationDate;
      },
      message: "Expiry date must be after the donation date",
    }
  },
  collectionAddress: {
    type: String,
    required: [true, "Collection address is required"], 
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
    required: true,
    default: "Pending",
  }, 
 
});

const donation = mongoose.model("donations",donationSchema);
module.exports = donation;
