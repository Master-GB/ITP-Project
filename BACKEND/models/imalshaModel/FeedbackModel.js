const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
   
    message: {
        type: String, // User's feedback message
        required: true,
        minlength: 10, // Ensure meaningful feedback
    },

    rating: {
        type: Number, // Rating system (optional)
        min: 1, // Minimum rating
        max: 5, // Maximum rating
        required: true,
    },
    

});

module.exports = mongoose.model(
    'FeedbackModel', FeedbackSchema
); 

