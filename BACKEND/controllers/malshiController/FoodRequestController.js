const FoodRequest = require("../../models/malshiModel/FoodRequestModel");

// Data display
const getAllRequests = async (req, res, next) => {
    let requests;

    // Get all requests
    try {
        requests = await FoodRequest.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }

    // Not found
    if (!requests) {
        return res.status(404).json({ 
            message: "Requests not found" });
    }

    // Display all requests
    return res.status(200).json({ requests });
};

//data insert
const addRequests = async (req, res,next) => {

    const {organizationName,location,contactNumber,foodType,quantity,additionalNotes} = req.body;

    let requests;

    try{
        requests = new FoodRequest({organizationName,location,contactNumber,foodType,quantity,additionalNotes,status:"pending" });
        await requests.save();
    }catch (err) {
        console.log(err);
    }
    //not insert requests
    if (!requests) {
        return res.status(404).json({message:"Unable to add requests"});
    }
    return res.status(200).json({ requests });
};

//Get by id
const getById = async (req, res, next) => {

    const requestId = req.params.requestId;

    let requests;

    try{
        requests = await FoodRequest.findById(requestId);
    }catch (err) {
        console.log(err);
    }
    //not available request
    if (!requests) {
        return res.status(404).json({ message: "Request not found"})
    }
    return res.status(200).json({ requests });
}

//update request details
const updateRequest = async (req, res, next) => {
    const requestId = req.params.requestId;
    const { organizationName, location, contactNumber, foodType, quantity, additionalNotes } = req.body;
    
    let requests;

    try {
        requests = await FoodRequest.findByIdAndUpdate(requestId, 
            { organizationName: organizationName, location: location, foodType: foodType, quantity: quantity, additionalNotes: additionalNotes});
            requests = await requests.save();

    } catch (err) {
        console.log(err);
    }

    if (!requests) {
        return res.status(404).json({ message: "Unable to Update user details" });
    }
    
    return res.status(200).json({ requests });
};

//Delete user
const deleteRequest = async (req, res, next) => {
    const requestId = req.params.requestId;

    let request;

    try{
       request = await FoodRequest.findByIdAndDelete(requestId) 
    }catch (err) {
        console.log(err);
    }
    if (!request) {
        return res.status(404).json({ message: "Unable to Delete user details" });
    }
    
    return res.status(200).json({ request });
};

exports.getAllRequests = getAllRequests;
exports.addRequests = addRequests;
exports.getById = getById;
exports.updateRequest = updateRequest;
exports.deleteRequest = deleteRequest;
