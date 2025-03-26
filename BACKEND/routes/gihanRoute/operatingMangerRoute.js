
const express = require("express");
const router = express.Router();
const inventoryCon = require("../../controllers/gihanController/operatingMangerController");

    router.post("/add",inventoryCon.addInventory);
    router.get("/display",inventoryCon.displayInventory);
    router.get("/getID/:id",inventoryCon.displayByID);
    router.delete("/delete/:id",inventoryCon.deleteInventory);
    router.put("/update/:id",inventoryCon.updateInventory);

module.exports = router;


