const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
require("dotenv").config();
const app = express();
const router=require("./routes/imalshaRoute/FeedbackRoute");
const userRouter = require('./routes/imalshaRoute/UserRoute');
const donorRoute = require("./routes/gihanRoute/donorRoute");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const PORT = process.env.PORT || 8090;


app.use(cors());
app.use(express.json());
app.use("/users",userRouter);
app.use(express.json());
app.use("/feedbacks",router);
app.use(bodyParser.json());
app.use("/donations",donorRoute);
const User = require('./models/imalshaModel/UserModel');

const URL = process.env.MONGODB_URL;

mongoose.connect(URL);

const connection = mongoose.connection;
connection.once("open",()=>{
    console.log("Mongo-DB Connection Successfull!")
})

app.listen(PORT,()=>{
    console.log(`Server is up and running on port no ${PORT}`)
});



app.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.json({err:"user Not Found"})
        }
        if(user.password === password){
            return res.json({statuse:"ok"});
        }else{
            return res.json({err:"incorrect password"});
        }

    }catch{
        console.error(err);
        res.status(500).json({err:"server Err"})
    }
});