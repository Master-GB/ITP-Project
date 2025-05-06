const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
require("dotenv").config();
const app = express();

// Import routes
const feedbackRouter = require("./routes/imalshaRoute/FeedbackRoute");
const userRouter = require('./routes/imalshaRoute/userRoute');
const authRouter = require('./routes/imalshaRoute/authRoute');
const donorRoute = require("./routes/gihanRoute/donorRoute");
const operatingManagerRoute = require("./routes/gihanRoute/operatingMangerRoute");
const RequestRoute = require("./routes/malshiRoute/FoodRequestRoute");
const taskRoute = require("./routes/daniruRoute/TaskRoutes");
const volunteerRoute = require("./routes/daniruRoute/VolunteerRoutes");

const PORT = process.env.PORT || 8090;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
}));

app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/Requests", RequestRoute);
app.use("/feedbacks", feedbackRouter);
app.use("/donations", donorRoute);
app.use("/inventory", operatingManagerRoute);
app.use("/tasks", taskRoute);
app.use("/volunteers", volunteerRoute);

// MongoDB Connection
const URL = process.env.MONGODB_URL;
mongoose.connect(URL);

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Mongo-DB Connection Successful!");
});


//login........
app.post("/login",async(req,res)=>{

    const {email,password}=req.body;

    try{
        const user=await User.findOne({email});
        if(!user){
            return res.json({err:"user Not Found"})

        }
        if(user.password === password){
            return res.json({status:"ok"});
        }else{
            return res.json({err:"incorrect Password"});
        }
    }catch(err){
        console.error(err);
        res.status(500).json({err:"server Err"})
    }

});

const taskRoutes = require('./routes/daniruRoute/TaskRoutes');
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log(`Server is up and running on port no ${PORT}`);
});

