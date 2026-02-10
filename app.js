if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const flash = require("connect-flash");

// Handle potential ESM/CommonJS export issues with connect-mongo
let MongoStore = require('connect-mongo');
if (MongoStore.default) {
    MongoStore = MongoStore.default;
}

const User = require("./models/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const expressError = require("./utils/expressError.js");

const dbUrl = process.env.ATLASDB_URL;

// --- Database Connectivity ---
async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => console.log("Connected to Atlas Venue Database"))
    .catch(err => console.log("Database Connection Error:", err));

// --- Template Engine Setup ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// --- General Middlewares ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// --- Session & MongoStore Configuration ---
// This keeps users logged in even if the server restarts
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // Avoid unnecessary session updates
});

store.on("error", (err) => {
    console.log("Session Store Error:", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // Security: prevents XSS access to cookies
    }
};

app.use(session(sessionOptions));
app.use(flash());

// --- Authentication (Passport Config) ---
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- Global Context Middleware ---
// Makes current user and flash messages available in all EJS templates
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// --- Main Routes ---
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// --- Error Handling ---
// Catch-all for undefined routes
app.all("*path", (req, res, next) => {
    next(new expressError(404, "Page Not Found!"));
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Use Render's port or default to 8080
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Book My Venue server is listening on port ${port}`);
});