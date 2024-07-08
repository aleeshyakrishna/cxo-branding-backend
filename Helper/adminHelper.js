const mongoose = require("mongoose");
const User = require("../model/userModel");

module.exports = {
  getUserDetails: async () => {
    let usersData = [];
    return new Promise(async (resolve, reject) => {
      try {
        User.find()
          .exec()
          .then((result) => {
            usersData = result;
            resolve(result);
            console.log("userDetails", result);
          });
      } catch (error) {}
    });
  },
};
