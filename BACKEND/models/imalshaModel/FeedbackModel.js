const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
    name:{
        type:String,//dataType
        required:true,//validate

    },

    gmail:{
        type:String,
        required:true,
    },

    role: {
        type: String, // User's role in the system
        enum: ['Donor', 'Recipient', 'Volunteer', 'Admin'], // Predefined roles
        required: true,
    },

    feedbackType: {
        type: String, // Type of feedback
        enum: ['Suggestion', 'Complaint', 'Appreciation', 'Issue', 'Other'], // Fixed categories
        required: true,
    },

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

    createdAt: {
        type: Date, // Timestamp for when feedback was submitted
        default: Date.now,
    }
});

module.exports = mongoose.model(
    'FeedbackModel', FeedbackSchema
); 