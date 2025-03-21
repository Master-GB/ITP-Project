const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodRequestSchema = new Schema({
    organizationName: {
        type: String,
        required: true,
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
        enum: ["Type01", "Type02", "Type03", "Others"],
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
});

module.exports = mongoose.model("FoodRequest", FoodRequestSchema);
