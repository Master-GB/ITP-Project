const FoodRequest = require("../../models/malshiModel/FoodRequestModel");

// Data display
const getAllRequests = async (req, res, next) => {
    let requests;

    // Get all requests
    try {
        requests = await FoodRequest.find().sort({ createdAt: -1 }); // Sort by creation date, newest first
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
const addRequests = async (req, res, next) => {
    const {location, contactNumber, foodType, quantity, additionalNotes} = req.body;

    // Generate request code
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // last 2 digits
    const monthLetter = now.toLocaleString('default', { month: 'long' })[0].toUpperCase();
    const uniqueNum = Math.floor(Math.random() * 90 + 10); // 2 digit random number
    const requestCode = `REQ-${year}${monthLetter}-${uniqueNum}`;

    let requests;

    try {
        requests = new FoodRequest({
            requestCode,
            location,
            contactNumber,
            foodType,
            quantity,
            additionalNotes,
            status: "pending"
        });
        await requests.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Error creating request"});
    }

    //not insert requests
    if (!requests) {
        return res.status(404).json({message: "Unable to add requests"});
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
    
    const { location, contactNumber, foodType, quantity, additionalNotes } = req.body;
    
    try {
        const updatedRequest = await FoodRequest.findByIdAndUpdate(
            requestId,
            { 
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
