const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trackingSchema = new Schema({
    userid:{
        type:String,//dataType:String
        required:true,//validate
    },
    name:{
        type:String,//dataType:String
        required:true,//validate
    },
    date:{
        type:Date,//dataType:String
        required:true,//validate
    },
    time:{
        type:String,//dataType:String
        required:true,//validate
    },
    currentlocation:{
        type:String,//dataType:String
        required:true,//validate
    },
    destination:{
        type:String,//dataType:String
        required:true,//validate
    }
});  

module.exports = mongoose.model(
    "trackingModel",//file name
    trackingSchema //function name
);