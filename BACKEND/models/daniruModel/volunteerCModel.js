const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const volunteerSchema = new Schema({
    description:{
        type:String,//dataType
        required:true,//validate
    },
    location:{
        type:String,//dataType
        required:true,//validate
    },
    dateTime:{
        type:String,//dataType
        required:true,//validate
    },
    status:{
        type:String,//dataType
        required:true,//validate
    }
});

module.exports = mongoose.model(
    "VolunteerModel",//file name
    volunteerSchema //function name
)