const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
require("dotenv").config();
const app = express();
const router=require("./routes/imalshaRoute/FeedbackRoute");

const donorRoute = require("./routes/gihanRoute/donorRoute")
const RequestRoute = require("./routes/malshiRoute/FoodRequestRoute");

const PORT = process.env.PORT || 8090;

app.use(express.json());

app.use("/Requests",RequestRoute);
=======
app.use("/feedbacks",router);

app.use(cors());
app.use(bodyParser.json());
app.use("/donations",donorRoute);


const URL = process.env.MONGODB_URL;

mongoose.connect(URL);

const connection = mongoose.connection;
connection.once("open",()=>{
    console.log("Mongo-DB Connection Successfull!")
})

app.listen(PORT,()=>{
    console.log(`Server is up and running on port no ${PORT}`)
});
