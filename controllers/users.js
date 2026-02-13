const User = require("../models/user");

// Render the Signup Page
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// Handle User Registration
module.exports.signupUser = async (req, res, next) => {
    try {
        let { username, email, password, phone } = req.body;
        const newUser = new User({ email, username, phone });
        
        const registeredUser = await User.register(newUser, password);
        
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


// Render Edit Profile Form
module.exports.renderProfileForm = (req, res) => {
    res.render("users/profile.ejs");
};

// Update Profile & Password
module.exports.updateProfile = async (req, res) => {
    try {
        let { email, phone, oldPassword, newPassword } = req.body;
        let user = await User.findById(req.user._id);

        //  Update Email & Phone
        user.email = email;
        user.phone = phone;
        await user.save();

        //  Handle Password Change ONLY if user filled the password fields
        if (oldPassword && newPassword) {
            try {
                await user.changePassword(oldPassword, newPassword);
            } catch (passwordErr) {
                
                req.flash("error", "The current password you entered is incorrect.");
                return res.redirect("/profile");
            }
        }

        req.flash("success", "Profile updated successfully!");
        res.redirect("/listings");
        
    } catch (e) {
        req.flash("error", "Failed to update: " + e.message);
        res.redirect("/profile");
    }
};