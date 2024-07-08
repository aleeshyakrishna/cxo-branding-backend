const mongoose = require("mongoose");
const {
  User,
  resumeProfile,
  JobAdvice,
  personalizedWebsite,
  videoResume,
  socialProfile,
  logoKit,
  googleLogin,
} = require("../model/userModel"); // Check the path to make sure it's correct
const bcrypt = require("bcrypt");

const cloudinary = require('../cloudinary/cloudinaryConfig')
// const { validateVideoLink } = require("../videoValidator/VideoValidator");
module.exports = {
  signUp: async (userdata) => {
    return new Promise(async (resolve, reject) => {
      try {
        const emailExist = await User.findOne({ email: userdata.email });
        if (emailExist) {
          resolve({
            emailExist: true,
            message: "User already exists. Go to login.",
          });
        } else {
          var hashPassword = await bcrypt.hash(userdata.password, 10);
          const data = {
            fullName: userdata.fullName,
            email: userdata.email,
            phoneNo: userdata.phoneNo,

            password: hashPassword,
          };

          console.log(data, "......");
          await User.create(data).then((data) => {
            resolve({ data, status: true });
          });
        }
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },

  dologin: async (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          resolve({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          resolve({ success: false, message: "Invalid credentials" });
        }

        resolve({ success: true, user });
      } catch (error) {
        console.error(error);
        resolve({ success: false, message: "An error occurred" });
      }
    });
  },

  findUserByGoogleId: async (googleId) => {
    try {
      // Find user by Google ID
      const user = await googleLogin.findOne({ googleId });
      return user;
    } catch (error) {
      console.error(error);
      throw new Error("Error finding user by Google ID");
    }
  },

  createUser: async (profile) => {
    try {
      // Create a new user based on Google OAuth profile data
      const newUser = new googleLogin({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.email,
        image: profile.photos[0].value,
      });
      // Save the new user to the database
      const user = await newUser.save();
      return user;
    } catch (error) {
      console.error(error);
      throw new Error("Error creating user");
    }
  },

  createResumeProfile: async (
    userId,
    fileUrl,
    socialMediaLink,
    wantComplimentaryCall
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await User.findById(userId);

        if (!user) {
          user = await googleLogin.findOne({ _id: userId });
        }

        if (!user) {
          return { success: false, message: "User not found" };
        }
        // const uploadedFile = await cloudinary.uploader.upload(file.buffer, {
        //   folder: "resume", // You can customize the folder where Cloudinary stores the file
        //   // Additional Cloudinary options if needed

        const createdResume = await resumeProfile.create({
          userId: user._id,
          fileUrl: fileUrl,
          socialMediaLink: socialMediaLink,
          wantComplimentaryCall: wantComplimentaryCall,

          // complimentaryCall: resumeData.complimentaryCall,
        });

        resolve({ success: true, createdResume });
      } catch (error) {
        console.error(error);
        reject({
          success: false,
          message: "An error occurred while creating the resume profile",
        });
      }
    });
  },

  createJobadvice: async (
    userId,
    fileUrl,
    socialMediaLink,
    wantComplimentaryCall
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await User.findById(userId);
        console.log(user, "user in the create job advice");

        if (!user) {
          user = await googleLogin.findOne({ _id: userId });
        }

        if (!user) {
          // Handle the case where the user with the given userId is not found
          return reject({ success: false, message: "User not found" });
        }

        const createJobData = await JobAdvice.create({
          userId: user._id,
          fileUrl: fileUrl,
          socialMediaLink: socialMediaLink,
          wantComplimentaryCall: wantComplimentaryCall,
        });

        resolve({ success: true, createJobData });
      } catch (error) {
        reject({
          success: false,
          message: "An error occurred while creating the job advice profile",
          error: error.message, // Include the specific error message for debugging
        });
      }
    }).catch((error) => {
      console.error("Unhandled promise rejection:", error);
      // Handle the error here or log it
      return {
        success: false,
        message: "Unhandled promise rejection",
        error: error.message,
      };
    });
  },

  createWebsite: async (userId, websiteData) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("useridddddd", userId);
        let user = await User.findById(userId);
        console.log(user, "user in create website");
        if (!user) {
          user = await googleLogin.findOne({ _id: userId });
        }
        if (!user) {
          // Handle the case where the user with the given userId is not found
          return { success: false, message: "User not found" };
        }
        websiteData.user = user._id;
        const createWebsite = await personalizedWebsite.create({
          user: userId,
          //   contactInformation: websiteData.contactInformation,
          //   typeOfWebsite: websiteData.typeOfWebsite,
          //   domainNamePreference: websiteData.domainNamePreference,
          //   designPreference: websiteData.designPreference,
          existingWebsite: websiteData.existingWebsite,
          //   contentPreference: websiteData.contentPreference,
          socialMediaLinks: websiteData.socialMediaLinks,
          //   currentLocation: websiteData.currentLocation,
          //   contactPreferences: websiteData.contactPreferences,
        });
        resolve({ success: true, createWebsite });
      } catch (error) {
        reject({
          success: false,
          message:
            "An error occurred while creating the personal website profile",
        });
      }
    });
  },
  createVideoResume: async (userId, location, needCall) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await User.findById(userId);
        console.log(user, "user in the create video resume");

        // If the user is not found in the User collection, check the googleLogin collection
        if (!user) {
          user = await googleLogin.findOne({ _id: userId });
        }

        if (!user) {
          return reject({ success: false, message: "User not found" });
        }

        const createVideoResume = await videoResume.create({
          user: user._id,
          location: location,
          wantComplimentaryCall: needCall,
        });
        resolve({ success: true, createVideoResume });
      } catch (error) {
        console.error("Error in createVideoResume:", error);
        reject({
          success: false,
          message: "An error occurred while creating the video resume profile",
        });
      }
    }).catch((error) => {
      // Handle any unhandled promise rejections here
      console.error("Unhandled promise rejection:", error);
      throw error; // Rethrow the error to crash the application
    });
  },

  createSocialProfie: async (userId, socialProfileData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findById(userId);
        console.log(user, "user in the social profile management");

        if (!user) {
          user = await googleLogin.findOne({ _id: userId });
        }
        if (!user) {
          // Handle the case where the user with the given userId is not found
          return { success: false, message: "User not found" };
        }
        socialProfileData.user = user._id;
        const createSocialProfile = await socialProfile.create({
          user: user._id,
          socialMediaLinks: socialProfileData.socialMediaLinks,
          //   socialMediaStrategy: socialProfileData.socialMediaStrategy,
          socialMediaPlatform: socialProfileData.socialMediaPlatform,
          //   profileOptimization: socialProfileData.profileOptimization,
          //   trackIndustryTrends: socialProfileData.trackIndustryTrends,
          //   influencerCollaboration: socialProfileData.influencerCollaboration,
          //   trendsAnalysis: socialProfileData.trendsAnalysis,
          //   paidSocialAdvertising: socialProfileData.paidSocialAdvertising,
        });
        resolve({ success: true, createSocialProfile });
      } catch (error) {
        reject({
          success: false,
          message:
            "An error occurred while creating the social profile management",
        });
      }
    });
  },
  createLogokit: async (userId, socialMediaLink, wantComplimentaryCall) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await User.findById(userId);
        console.log(user, "user in the logokit");

        // If the user is not found in the User collection, check the googleLogin collection
        if (!user) {
          user = await googleLogin.findOne({ _id: userId });
        }

        if (!user) {
          return reject({ success: false, message: "User not found" });
        }

        const createLogokit = await logoKit.create({
          user: user._id,
          socialMediaLink: socialMediaLink,
          wantComplimentaryCall: wantComplimentaryCall,
        });
        resolve({ success: true, createLogokit });
      } catch (error) {
        console.error("Error in createLogokit:", error);
        reject({
          success: false,
          message: "An error occurred while creating the logokit",
        });
      }
    }).catch((error) => {
      // Handle any unhandled promise rejections here
      console.error("Unhandled promise rejection:", error);
      throw error; // Rethrow the error to crash the application
    });
  },
};
