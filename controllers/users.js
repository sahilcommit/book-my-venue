const User = require("../models/user");

// Render the Signup Page
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// Handle User Registration
module.exports.signupUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        
        // Automatically log in the user after successful registration
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Book My Venue!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Render the Login Page
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Handle User Login
module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome back to Book My Venue!");
    // Uses the redirectUrl saved by the middleware, or defaults to the listings page
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// Handle User Logout
module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are now logged out.");
        res.redirect("/listings");
    });
};