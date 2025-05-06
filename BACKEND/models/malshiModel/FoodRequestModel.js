const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodRequestSchema = new Schema({
    requestCode: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    foodType: {
        type: String,
        required: true,
        enum: ["Milk Rice", "White Rice", "Biriyani", "Yellow Rice", "Noodles", "Koththu"],
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    additionalNotes: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("FoodRequest", FoodRequestSchema);
