const User = require('../../models/imalshaModel/UserModel');
const Feedback = require('../../models/imalshaModel/FeedbackModel');


//display all users

const getAllUsers = async (req, res, next) => {
    let users;

    try {
        users = await User.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error fetching users' });
    }
//not found

    if (!users) {
        return res.status(404).json({
            message: 'No users found!'
        });
    }

    //Display all users
    return res.status(200).json({
        users
    });

    
};

//data insert
const createUser = async (req, res, next) => {
    const { name, email, role, contactNumber, address, password } = req.body;
    let existingUser;

    try {
        existingUser=new User({
            name,
            email,
            role,
            contactNumber,
            address,
            password
        });
        await existingUser.save();
    } catch (err) {
        console.log(err);
    }   
    //not fount
    if (!existingUser) {
        return res.status(404).json({
            message: 'User not found!'
        });
    }
    return res.status(201).json({
        existingUser
    });
};




//get by id
const getUserById = async (req, res, next) => {
    const userId = req.params.id;
    let user;

    try {
        user = await User
            .findById(userId);          
    }
    catch (err) {
        console.log(err);
    }   

    //not found
    if (!user) {
        return res.status(404).json({
            message: 'User not found!'
        });
    }
    return res.status(200).json({
        user
    });
};

//Update user
const updateUser = async (req, res, next) => {
    const userId = req.params.id;
    const { name, email, role, contactNumber, address, password } = req.body;
    let user;

    try {
        user = await User.findByIdAndUpdate(userId,{
            name:name,
            email:email,
            role:role,
            contactNumber:contactNumber,
            address:address,
            password:password
            
        });
        user=await user.save();
        
    } catch (err) {
        console.log(err);
    }

    //not found
    if (!user) {
        return res.status(404).json({
            message: 'User not found!'
        });
    }

    return res.status(200).json({
        user
    });
};

//Delete user
const deleteUser = async (req, res, next) => {
    const userId = req.params.id;
    let user;

    try {
        user=await User.findByIdAndDelete(userId);
    }catch(err){
        console.log(err);
    }
    if (!user) {
        return res.status(404).json({
            message: 'User not found!'
        });
    }
    return res.status(200).json({
        message: 'User deleted successfully!'
    });
};




exports.getAllUsers = getAllUsers;
exports.createUser = createUser;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
