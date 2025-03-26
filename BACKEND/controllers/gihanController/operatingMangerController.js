const inventorynModel = require("../../models/gihanModel/operatingManagerModel");

const addInventory = async (req, res) => {
  const {
    foodCategory,
    foodItem,
    storageCondition,
    expiryDate,
    quantity,
    quantityUnit,
    finalQuantity,
    location,
    status,
  } = req.body;


  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be a positive number" });
  }

  let inventory;


  try {
    inventory = new donationModel({
      foodCategory,
      foodItem,
      storageCondition,
      expiryDate,
      quantity,
      quantityUnit,
      finalQuantity,
      location,
      status,
    });
    await inventory.save();
    return res
      .status(200)
      .json({ message: "inventory added successfully", donate });
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

const displayInventory = async (req, res) => {
  let inventories;

  try {
    inventories = await inventorynModel.find();
    if (inventories === 0) {
      return res.status(404).json({ message: "inventory not found" });
    }

    return res.status(200).json({ inventories });
  } catch (error) {
    console.error("Error fetching inventory:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const displayByID = async (req, res) => {
  const id = req.params.id;

  try {
    const inventory = await inventorynModel.findById(id);
    if (!inventory) {
      return res.status(404).json({ message: "inventory not found" });
    }
    return res
      .status(200)
      .json({ message: "inventory found successfully", inventory });
  } catch (error) {
    console.log("Error fetching inventory:", error.message);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

const deleteInventory = async (req, res) => {
  const id = req.params.id;

  try {
    const deleteInventory = await inventorynModel.findByIdAndDelete(id);

    if (!deleteInventory) {
      return res
        .status(404)
        .json({ message: "inventory not found & Cannot delete" });
    }
    return res
      .status(200)
      .json({ message: "inventory deleted Successfully ", deleteInventory });
  } catch (error) {
    console.log("error deleting donation" + error.message);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

const updateInventory = async (req, res) => {
  const id = req.params.id;
  
  const {
    quantity,
    quantityUnit,
    finalQuantity,
    location,
  } = req.body;


  const quantityWithUnit = `${quantity} ${quantityUnit}`;

    try {
    const updatedInventory = await inventorynModel.findByIdAndUpdate(
      id,
      {
        quantity,
        quantityUnit,
        finalQuantity : quantityWithUnit,
        location,
      },
      { new: true}
    );

    if (!updatedInventory) {
      return res
        .status(404)
        .json({ message: "inventory not found and cannot update" });
    }

    return res
      .status(200)
      .json({ message: "inventory updated successfull", updatedDonation });
  } catch (error) {
    console.log("Error updating donation" + error.message);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

exports.displayByID = displayByID;
exports.addInventory = addInventory;
exports.displayInventory = deleteInventory;
exports.deleteInventory = deleteInventory;
exports.updateInventory = updateInventory;
