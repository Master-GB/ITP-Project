const tracking = require("../../../models/sashiniModel/trackingModel");

//data display
const getAlltrackings = async (req, res, next) => {

    let trackings;

    // get all trackings
    try{
        trackings = await tracking.find();
    }catch (err) {
        console.log(err);
        return res.status(500).json({ message: " server error "});
    }
    // not found
    if(!trackings){
        return res.status(404).json({ message: " tracking not found "});
    }
    //display all trackings
    return res.status(200).json({ trackings });
};

//data insert
const addtrackings = async (req, res, next) => {

const {userid,name,date,time,currentlocation,destination} = req.body;

let trackings;

try {
    trackings = new tracking({userid,name,date,time,currentlocation,destination});
    await trackings.save();
}catch (err){
    console.log(err);
}
// not insert trackings
if (!trackings) {
    return res.status(404).json({message:"Unable to add trackings"});
}
return res.status(200).json({ trackings });

};
//grt by Id
const getById = async (req, res, next) => {

    const trackingId = req.params.trackingId;

    let trackings;

    try{
        trackings = await tracking.findById(trackingId);
    }catch (err) {
        console.log(err);
    }
    //not available trackings
    if (!trackings) {
        return res.status(404).json({ message: "tracking not found"})
    }
    return res.status(200).json({ trackings });
}
// update tracking details
const updatetracking = async (req, res, next) => {
    const trackingId = req.params.trackingId;
    const { userid,name,date,time,currentlocation,destination } = req.body;
    
    let trackings;

    try {
        trackings = await tracking.findByIdAndUpdate(trackingId, 
            { userid: userid, name: name, date: date, time: time, currentlocation: currentlocation, destination: destination});
            trackings = await trackings.save();

    } catch (err) {
        console.log(err);
    }

    if (!trackings) {
        return res.status(404).json({ message: "Unable to Update tracking details" });
    }
    
    return res.status(200).json({ trackings });
};
//Delete tracking
const deletetracking = async (req, res, next) => {
    const trackingId = req.params.trackingId;

    let tracking;

    try{
       tracking = await tracking.findByIdAndDelete(trackingId) 
    }catch (err) {
        console.log(err);
    }
    if (!tracking) {
        return res.status(404).json({ message: "Unable to Delete tracking details" });
    }
    
    return res.status(200).json({ tracking });
};

exports.grtAlltrackings = getAlltrackings;
exports.addtrackings = addtrackings;
exports.getById = getById;
exports.updatetracking = updatetracking;
exports.deletetracking = deletetracking;