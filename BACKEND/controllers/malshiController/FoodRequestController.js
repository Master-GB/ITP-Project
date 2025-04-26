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

const updateRequest = async (req, res, next) => {
    const requestId = req.params.requestId;
    
    if (Object.keys(req.body).length === 1 && req.body.status) {
        try {
            const updatedRequest = await FoodRequest.findByIdAndUpdate(
                requestId,
                { status: req.body.status },
                { new: true }
            );
            
            if (!updatedRequest) {
                return res.status(404).json({ message: "Request not found" });
            }
            
            return res.status(200).json({ 
                message: "Status updated successfully",
                request: updatedRequest 
            });
        } catch (err) {
            console.error("Status update error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    
    const { organizationName, location, contactNumber, foodType, quantity, additionalNotes } = req.body;
    
    try {
        const updatedRequest = await FoodRequest.findByIdAndUpdate(
            requestId,
            { 
                organizationName, 
                location, 
                contactNumber,
                foodType, 
                quantity, 
                additionalNotes
            },
            { new: true }
        );
            
        if (!updatedRequest) {
            return res.status(404).json({ message: "Unable to update request details" });
        }
        
        return res.status(200).json({ request: updatedRequest });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
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
