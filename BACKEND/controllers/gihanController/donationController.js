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



exports.addDonation = addDonation;
exports.displayDonation = displayDonation;

