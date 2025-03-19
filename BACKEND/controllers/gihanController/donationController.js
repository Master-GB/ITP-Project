const donationModel = require("../../models/gihanModel/donationModel");

const addDonation = async (req, res) => {
  const {
    foodCategory,
    foodItem,
    storageCondition,
    donationDate,
    expiryDate,
    collectionAddress,
    imageOfFoods,
    notes,
    status,
  } = req.body;

  if (expiryDate <= donationDate) {
    return res
      .status(400)
      .json({ message: "Expiry date must be after the donation date" });
  }

  let donate;

  try {
    donate = new donationModel({
      foodCategory,
      foodItem,
      storageCondition,
      donationDate,
      expiryDate,
      collectionAddress,
      imageOfFoods,
      notes,
      status,
    });
    await donate.save();
    return res
      .status(200)
      .json({ message: "donation added successfully", donate });
  } catch (error) {
    console.log("error" + error.message);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }

    return res
      .status(500)
      .json({ message: "Server error while saving donation" });
  }
};

const displayDonation = async (req, res) => {
  let donations;

  try {
    donations = await donationModel.find();
    if (donations === 0) {
      return res.status(404).json({ message: "donations not found" });
    }

    return res.status(200).json({ donations });
  } catch (error) {
    console.error("Error fetching donations:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }

};

const displayByID = async(req,res)=>{
    const id = req.params.id;

    try {
       const donation = await donationModel.findById(id);
        if(!donation){
            return res.status(404).json({message:"donation not found"})
        }
        return res.status(200).json({message: "donation found successfully",donation});
    } catch (error) {
        console.log("Error fetching donations:", error.message);
        return res.status(500).json({message:"Internal server Error"});
    }
}

const deleteDonation = async(req,res)=>{

    const id = req.params.id;

    try {
        const deletedDonation = await donationModel.findByIdAndDelete(id);

        if(!deletedDonation){
            return res.status(404).json({message : "donation not found & Cannot delete"})
        }
        return res.status(200).json({message : "donation deleted Successfully ", deletedDonation});
    } catch (error) {
        console.log("error deleting donation" + error.message);
        return res.status(500).json({message:"Internal server Error"});
    }
}

exports.displayByID = displayByID;
exports.addDonation = addDonation;
exports.displayDonation = displayDonation;
exports.deleteDonation = deleteDonation;


