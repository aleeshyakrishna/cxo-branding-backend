// routes/googleAuth.js

const express = require("express");
const router = express.Router();
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userController = require("../Controller/userController");
const dotenv=require('dotenv');
dotenv.config()
const clientid = process.env.GOOGLE_CLIENT_ID
const clientsecret = process.env.GOOGLE_CLIENT_SECRET_KEY

// Initialize express session middleware
router.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport.js middleware
router.use(passport.initialize());
router.use(passport.session());

// Configure Google OAuth2Strategy
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

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Route for initiating Google OAuth2 authentication
router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route for handling Google OAuth2 callback
router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login", // Redirect to login page on failure
  }),
  (req, res) => {
    // On successful authentication, send the JWT token to the frontend
    res.redirect(`http://localhost:3000/login?token=${req.user.token}`);
  }
);

module.exports = router;
