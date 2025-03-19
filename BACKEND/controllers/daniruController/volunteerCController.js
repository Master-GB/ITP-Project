const Volunteer =require("../Model/VolunteerModel");

// data display
const getAllVolunteers = async (req, res, next) => {

    let Volunteers;
    // Get all volunteers
    try{
        volunteers = await Volunteer.find();
    }catch (err) {
        console.log(err);
    }
    //not found
    if(!volunteers){
        return res.status(404).json({message:"Volunteer not found"});
    }
    //Display all users
    return res.status(200).json({ volunteers });
};

// data Insert
const addVolunteers = async (req, res, next) => {

    const { description, location, dateTime, status } = req.body;

    let volunteers;

    try{
        volunteers = new Volunteer({description,location,dateTime,status});
        await volunteers.save();
    }catch (err) {
        console.log(err);
    }
    // not insert volunteers
    if (!volunteers) {
        return res.status(404).json({ message: "unable to add volunteers" });
    }
    return res.status(200).json({ volunteers });
};

// get by id
const getById = async (req, res, next) => {

    const id = req.params.id;

    let volunteer;

    try{
        volunteer = await Volunteer.findById(id);
    }catch (err) {
        console.log(err);
    }
    // not available volunteers
    if (!volunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
    }
    return res.status(200).json({ volunteer });
};

// update user details
const updateVolunteer = async (req, res, next) => {
    const id = req.params.id;
    const { description, location, dateTime, status } = req.body;

    let volunteers;

    try{
        volunteers = await Volunteer.findByIdAndUpdate(id,
            { description : description, location : location, dateTime : dateTime, status : status});
            volunteers = await volunteers.save();
    }catch(err){
        console.log(err);
    }
    if (!volunteers) {
        return res.status(404).json({ message: "Unable to update volunteer details" });
    }
    return res.status(200).json({ volunteers });
};

// delete volunteer details
const deleteVolunteer = async (req, res, next) => {
    const id = req.params.id;

    let volunteer;

    try{
        volunteer = await Volunteer.findByIdAndDelete(id)
    }catch (err) {
        console.log(err);
    }
    if (!volunteer) {
        return res.status(404).json({ message: "Unable to delete volunteer details" });
    }
    return res.status(200).json({ volunteer });
};

exports.getAllVolunteers = getAllVolunteers;
exports.addVolunteers = addVolunteers;
exports.getById = getById;
exports.updateVolunteer = updateVolunteer;
exports.deleteVolunteer = deleteVolunteer;