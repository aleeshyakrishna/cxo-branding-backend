const express = require("express");
const router = express.Router();
const adminController = require("../Controller/adminController");

router.get("/users", adminController.getAllUsers);

module.exports = router;
