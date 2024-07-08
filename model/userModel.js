const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,

  phoneNo: String,
  email: { type: String, unique: true },

  password: String,
});

const googleUserSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
  image: String
},{timestamps:true})

const resumeProfileSchema = new mongoose.Schema({
  userId: String,
  fileUrl: String,

  socialMediaLink: String,
  wantComplimentaryCall: Boolean,
});

const jobAdviceSchema = new mongoose.Schema({
  userId: String,
  fileUrl: String,

  socialMediaLink: String,
  wantComplimentaryCall: Boolean,
});

const personalizedWebsiteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming there is a User model
    required: true,
  },
  
  existingWebsite: String, // URL or path to the existing website, if any
 
  socialMediaLinks: [String], // Array of social media links
  
});

const videoResumeSchema = new mongoose.Schema({
  userId: String,
  location: String,
  wantComplimentaryCall: Boolean,
});

const socialProfileManagementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming there is a User model
    required: true,
  },
  socialMediaLinks: {
    facebook: String,
    twitter: String,
    linkedIn: String,
    instagram: String,
    youtube: String,
    // Add more social media platforms as needed
  },
  
  socialMediaPlatform: String, // Specify the main platform to manage (e.g., "Facebook", "Instagram")
  
});


const businessCardSchema = new mongoose.Schema({
  userId: String,
  socialMediaLink: String,
  wantComplimentaryCall: Boolean,
});





const UserModel = mongoose.model("User", userSchema);
const GoogleLoginModel = mongoose.model("googleLogin",googleUserSchema)
const ResumeProfileModel = mongoose.model("resumeProfile", resumeProfileSchema);
const JobAdviceModel = mongoose.model("JobAdvice", jobAdviceSchema);
const PersonalisedWebsiteModel = mongoose.model(
  "personalWebsite",
  personalizedWebsiteSchema
);
const videoResumeModel = mongoose.model("videoResume", videoResumeSchema);
const socialProfileModel = mongoose.model(
  "socialProfile",
  socialProfileManagementSchema
);
const logokitModel = mongoose.model("logoKit", businessCardSchema);


module.exports = {
  User: UserModel,
  googleLogin : GoogleLoginModel,
  resumeProfile: ResumeProfileModel,
  JobAdvice: JobAdviceModel,
  personalizedWebsite: PersonalisedWebsiteModel,
  videoResume: videoResumeModel,
  socialProfile: socialProfileModel,
  logoKit: logokitModel,
};
