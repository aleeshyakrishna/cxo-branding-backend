const express = require("express");
const router = express.Router();
const upload = require('../Middleware/multerConfig')
const authenticateToken = require("../Middleware/authMiddleware");
const userController = require("../Controller/userController");

const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

const clientid =
  "605780761256-f5r78mdnrt7hfgnre9o0mgnocscn4no7.apps.googleusercontent.com";
const clientsecret = "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";

passport.use(
  new OAuth2Strategy(
    {
      clientID: clientid,
      clientSecret: clientsecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    userController.googleOAuthCallback
  )
);

router.get("/", userController.blank);
router.post("/signup", userController.registerUser);
router.post("/login", userController.userLogin);

router.get("/login/success", async (req, res) => {
  console.log("reqq", req.user);
});
// router.get("/protected", userController.protectedResource);

router.post(
  "/uploadpdf",
  authenticateToken,
  userController.uploadpdf
);
router.post(
  "/post-jobadvice",
  authenticateToken,
  userController.postJobadvice
);
router.post(
  "/post-personalisedwebsite",
  authenticateToken,
  // authorizeRole(["personalised_website"]),
  userController.postPersonalisedWebsite
);

router.post(
  "/post-videoresume",
  authenticateToken,
  // authorizeRole(["video_resume"]),
  userController.videoResume
);

router.post(
  "/post-socialProfile",
  authenticateToken,
  // authorizeRole(["social_profile"]),
  userController.socialProfile
);

router.post(
  "/post-logokit",
  authenticateToken,
  // authorizeRole(["logokit"]),
  userController.logoKit
);

module.exports = router;
