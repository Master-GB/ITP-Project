const Feedback=require('../../models/imalshaModel/FeedbackModel');

//display all feedbacks
const getAllFeedbacks = async (req, res,next) => {
    let feedbacks;

    try {
        feedbacks = await Feedback.find();
    } catch (err) {
        console.log(err);
    }
//not found
    if (!feedbacks) {
        return res.status(404).json({
            message: 'No feedbacks found!'
        });
    }

    //Display all feedbacks
    return res.status(200).json({
        feedbacks
    });

    
};

//data insert
const createFeedback = async (req, res,next) => {
    const { name, gmail, role, feedbackType, message, rating,createdAt } = req.body;

    let newFeedback;

    try{
        newFeedback = new Feedback({
            name,
            gmail,
            role,
            feedbackType,
            message,
            rating,
            createdAt
        });
        await newFeedback.save();
    }
    catch(err){
        console.log(err);
    }

    //not created
    if (!newFeedback) {
        return res.status(404).json({
            message: "Feedback creation failed!"
        });
    }
    return res.status(200).json({newFeedback});

   
};
//get by id

const getFeedbackById = async (req, res,next) => {
    const feedbackId = req.params.fid;
    let feedback;

    try {
        feedback = await Feedback.findById(feedbackId);
    } catch (err) {
        console.log(err);
    }

    //not found
    if (!feedback) {
        return res.status(404).json({
            message: 'Feedback not found!'
        });
    }

    return res.status(200).json({
        feedback
    });
};

//Update feedback

const updateFeedback = async (req, res,next) => {
    const feedbackId = req.params.fid;
    const { name, gmail, role, feedbackType, message, rating,createdAt } = req.body;

    let feedback;

    try {

        feedback= await Feedback.findByIdAndUpdate(feedbackId,{name:name, gmail:gmail, role:role, feedbackType:feedbackType, message:message, rating:rating,createdAt:createdAt});
        feedback= await Feedback.save();

    }
    catch(err){
        console.log(err);
    }

    //not updated
    if (!feedback) {
        return res.status(404).json({
            message: 'Feedback updation failed!'
        });
    }
    return res.status(200).json({
        feedback
    });
};

//Delete feedback

const deleteFeedback = async (req, res,next) => {
    const feedbackId = req.params.fid;
    let feedback;

    try {
        feedback = await Feedback.findByIdAndDelete(feedbackId);
    } catch (err) {
        console.log(err);
    }

    //not deleted
    if (!feedback) {
        return res.status(404).json({
            message: 'Feedback deletion failed!'
        });
    }

    return res.status(200).json({
        message: 'Feedback deleted successfully!'
    });
}

exports.getAllFeedbacks = getAllFeedbacks;
exports.createFeedback = createFeedback;
exports.getFeedbackById = getFeedbackById;
exports.updateFeedback = updateFeedback;
exports.deleteFeedback = deleteFeedback; 