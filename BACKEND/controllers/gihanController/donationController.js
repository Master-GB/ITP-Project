const donationModel = require("../../models/gihanModel/donationModel");
const upload = require("./multerConfig");

const addDonation = async (req, res) => {
  const {
    foodCategory,
    foodItem,
    storageCondition,
    donationDate,
    expiryDate,
    quantity,
    quantityUnit,
    finalQuantity,
    collectionAddress,
    notes,
    status,
  } = req.body;

  const imageOfFoods = req.file ? req.file.buffer : null;

  if (expiryDate <= donationDate) {
    return res
      .status(400)
      .json({ message: "Expiry date must be after the donation date" });
  }

  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be a positive number" });
  }

  let donate;
  const quantityWithUnit = `${quantity} ${quantityUnit}`;
  const finalFoodItem = foodItem || foodCategory;

  try {
    donate = new donationModel({
      foodCategory,
      foodItem : finalFoodItem,
      storageCondition,
      donationDate,
      expiryDate,
      quantity,
      quantityUnit,
      finalQuantity : quantityWithUnit,
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

const displayByID = async (req, res) => {
  const id = req.params.id;

  try {
    const donation = await donationModel.findById(id);
    if (!donation) {
      return res.status(404).json({ message: "donation not found" });
    }
    return res
      .status(200)
      .json({ message: "donation found successfully", donation });
  } catch (error) {
    console.log("Error fetching donations:", error.message);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

const deleteDonation = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedDonation = await donationModel.findByIdAndDelete(id);

    if (!deletedDonation) {
      return res
        .status(404)
        .json({ message: "donation not found & Cannot delete" });
    }
    return res
      .status(200)
      .json({ message: "donation deleted Successfully ", deletedDonation });
  } catch (error) {
    console.log("error deleting donation" + error.message);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

const updateDonation = async (req, res) => {
  const id = req.params.id;

  if (Object.keys(req.body).length === 1 && req.body.status) {
    try {
      const updatedDonation = await donationModel.findByIdAndUpdate(
        id,
        { status: req.body.status },
        { new: true }
      );
      
      if (!updatedDonation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      
      return res.status(200).json({ 
        message: "Status updated successfully",
        updatedDonation 
      });
    } catch (error) {
      console.error("Status update error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  
  const {
    foodCategory,
    foodItem,
    storageCondition,
    donationDate,
    expiryDate,
    quantity,
    quantityUnit,
    collectionAddress,
    imageOfFoods,
    notes
  } = req.body;

  if (expiryDate <= donationDate) {
    return res
      .status(400)
      .json({ message: "Expiry date must be after the donation date" });
  }


  const quantityWithUnit = `${quantity} ${quantityUnit}`;
  const finalFoodItem = foodItem || foodCategory;

    try {
      // Convert the file buffer to base64 if it exists
      let imageOfFoods = null;
      if (req.file) {
        imageOfFoods = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      }
    const updatedDonation = await donationModel.findByIdAndUpdate(
      id,
      {
        foodCategory,
        foodItem : finalFoodItem,
        storageCondition,
        donationDate,
        expiryDate,
        quantity,
        quantityUnit,
        finalQuantity : quantityWithUnit,
        collectionAddress,
        imageOfFoods,
        notes
      },
      { new: true}
    );

    if (!updatedDonation) {
      return res
        .status(404)
        .json({ message: "donation not found and cannot update" });
    }

    return res
      .status(200)
      .json({ message: "donation updated successfull", updatedDonation });
  } catch (error) {
    console.log("Error updating donation" + error.message);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

exports.displayByID = displayByID;
exports.addDonation = addDonation;
exports.displayDonation = displayDonation;
exports.deleteDonation = deleteDonation;
exports.updateDonation = updateDonation;
