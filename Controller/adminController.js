const adminHelper = require("../Helper/adminHelper");
const User = require("../model/userModel");
module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const usersData = await adminHelper.getUserDetails();
      console.log(usersData);
      res.status(200).json({
        success: true,
        message: "User details fetched successfully",
        data: usersData,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Error fetching user details",
        error: err.message,
      });
    }
  },
};
