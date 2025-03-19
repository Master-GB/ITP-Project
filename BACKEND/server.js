const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
require("dotenv").config();
const app = express();

const donorRoute = require("./routes/gihanRoute/donorRoute")

const PORT = process.env.PORT || 8090;

app.use(cors());
app.use(bodyParser.json());
//app.use("/donors",donorRoute);

const URL = process.env.MONGODB_URL;

mongoose.connect(URL,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

const connection = mongoose.connection;
connection.once("open",()=>{
    console.log("Mongo-DB Connection Successfull!")
})

app.listen(PORT,()=>{
    console.log(`Server is up and running on port no ${PORT}`)
});
