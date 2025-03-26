const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
  foodCategory: {
    type: String,
    required: [true, "Food category is required"],
  },
  foodItem: {
    type: String,
    default: "",
  },
  storageCondition: {
    type: String,
    required: [true, "Storage Condition is required"],
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
  quantity: {
    type: String,
    required: [true, "Quantity is required"],
  },

  quantityUnit: {
    type: String,
    required: [true, "Quantity is required"],
  },

  finalQuantity:{
    type: String,
    default: "",
  },

  location:{
    type:String,
    default:""
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
 
});

const inventory = mongoose.model("inventories",inventorySchema);
module.exports = inventory;
