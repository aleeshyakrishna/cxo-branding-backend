const userHelper = require("../Helper/userHelper");
const jwt = require("jsonwebtoken");
// const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

// const cloudinary = require("cloudinary").v2;


const secretKey = process.env.SECRET_KEY || "default-secret-key";
// userController.js

require("dotenv").config();

module.exports = {
  blank: async (req, res) => {
    try {
      console.log("/api");
      res.send("cxo branding");
    } catch (err) {
      console.log(err);
    }
  },
  registerUser: async (req, res) => {
    try {
      console.log("req.bosy", req.body);
      const response = await userHelper.signUp(req.body);
      console.log(response, "resssssssssss");
      res.status(200).json({
        success: true,
        message: "User details added successfully",
        userData: response.data,
      });
    } catch (err) {
      console.log(err);
    }
  },
  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const response = await userHelper.dologin(email, password);

      if (response.success) {
        const userData = response.user;
        const token = generateToken(response.user);
        console.log("Token:", token);
        res.status(200).json({ success: true, userData, token });
      } else {
        res.status(401).json({ success: false, message: response.message });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    function generateToken(user) {
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        secretKey,
        { expiresIn: "1h" } // Token expiration time
      );
      return token;
    }
  },

  googleOAuthCallback: async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if the user exists in the database
      let user = await userHelper.findUserByGoogleId(profile.id);
      if (!user) {
        // If user doesn't exist, create a new user
        user = await userHelper.createUser(profile);
      }
      const token = generateToken(user);
      console.log("tooooo in google",token);
      // Pass user data to the next middleware
      return done(null, { user, token });
    } catch (error) {
      return done(error, null);
    }
    function generateToken(user) {
    const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        secretKey,
        { expiresIn: '1h' } // Token expiration time
    );
    return token;
}
  },

  
  

  protectedResource: async (req, res) => {
    res.json({ success: true, message: "This is a protected resource" });
  },

  postJobadvice: async (req, res) => {
    const userId = req.user.userId;
    const fileUrl = req.body.fileUrl;
    const socialMediaLink = req.body.socialMediaLink;
    const needCall = req.body.wantComplimentaryCall;
    console.log(fileUrl, "data");
    console.log(socialMediaLink, "socialMediaLink");
    console.log(needCall, "needCall");
    const response = await userHelper.createJobadvice(
      userId,
      fileUrl,
      socialMediaLink,
      needCall
    );
    if (response.success) {
      res.status(201).json(response);
    } else {
      res.status(400).json(response);
    }
  },
  postPersonalisedWebsite: async (req, res) => {
    const userId = req.user.userId;
    console.log(userId);
    const websiteData = req.body.website;
    console.log("website", websiteData);
    const response = await userHelper.createWebsite(userId, websiteData);
    if (response.success) {
      res.status(201).json(response);
    } else {
      res.status(400).json(response);
    }
  },

  videoResume: async (req, res) => {
    const userId = req.user.userId;
    const location = req.body.currentLocation;
    const needCall = req.body.wantComplimentaryCall;
    const response = await userHelper.createVideoResume(
      userId,
      location,
      needCall
    );
    if (response.success) {
      res.status(201).json(response);
    } else {
      res.status(400).json(response);
    }
  },

  socialProfile: async (req, res) => {
    const userId = req.user.userId;
    const socialProfileData = req.body;
    const response = await userHelper.createSocialProfie(
      userId,
      socialProfileData
    );
    if (response.success) {
      res.status(201).json(response);
    } else {
      res.status(400).json(response);
    }
  },

  logoKit: async (req, res) => {
    const userId = req.user.userId;
    const socialMediaLink = req.body.socialMediaLink;
    const needCall = req.body.wantComplimentaryCall;

    console.log(socialMediaLink, "socialMediaLink");
    console.log(needCall, "needCall");
    const response = await userHelper.createLogokit(
      userId,
      socialMediaLink,
      needCall
    );
    if (response.success) {
      res.status(201).json(response);
    } else {
      res.status(400).json(response);
    }
  },

  uploadpdf: async (req, res) => {
    
    try {
      console.log("haaaaaaaaaaaaaaaiiiii",req.body);
      const fileUrl = req.body.fileUrl;
      const userId = req.user.userId;
      console.log(fileUrl, "llllllllllllll");
      const socialMediaLink = req.body.socialMediaLink;
      console.log(userId, "usr");
      console.log(socialMediaLink, "link");
      const wantComplimentaryCall = req.body.wantComplimentaryCall;
      const response = await userHelper.createResumeProfile(
        userId,
        fileUrl,
        socialMediaLink,
        wantComplimentaryCall
      );
      if (response.success) {
        res.status(201).json(response);
      } else {
        res.status(400).json(response);
      }
    } catch (error) {
      console.log(error);
      console.log("erooooooeeeeeer");
    }
  },
};
