const express=require("express");   
const router=express.Router();

//insert  model
const Feedback=require('../../models/imalshaModel/FeedbackModel');

//insert controller
const feedbackControl=require('../../controllers/imalshaController/FeedbackControl');


router.get("/",feedbackControl.getAllFeedbacks);
router.post("/",feedbackControl.createFeedback);
router.get("/:fid",feedbackControl.getFeedbackById); 
router.put("/:fid",feedbackControl.updateFeedback);
router.delete("/:fid",feedbackControl.deleteFeedback);

//export router
module.exports=router;

