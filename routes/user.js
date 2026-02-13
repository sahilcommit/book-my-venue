const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const usersController = require("../controllers/users.js");

// Signup Routes: Handles user registration
router
    .route("/signup")
    .get(usersController.renderSignupForm)
    .post(wrapAsync(usersController.signupUser));

// Login Routes: Handles user authentication
router
    .route("/login")
    .get(usersController.renderLoginForm)
    .post(
        saveRedirectUrl, // Middleware to capture the URL user was trying to access
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        usersController.loginUser
    );

// Logout Route: Destroys the user session
router.get("/logout", usersController.logoutUser);

// Profile Routes 
router
    .route("/profile")
    .get(isLoggedIn, usersController.renderProfileForm)
    .put(isLoggedIn, wrapAsync(usersController.updateProfile));

module.exports = router;