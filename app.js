require('dotenv').config()

const express = require("express");
const app = express();
const Listing = require("../Major Project/models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsyc = require("./utlis/wrapAsyc.js");
const ExpressError = require("./utlis/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("../Major Project/models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//mongodb://127.0.0.1:27017/wanderlust
const dbUrl = process.env.ATLASDB_URL;
const MongoDBUrl = dbUrl;

const store = MongoStore.create({
    mongoUrl: MongoDBUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in mongo session store", err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Root Route
// app.get("/", (req, res) => {
//     res.send('Hi, I am root');
// });


// Mongoose connection
const mongoose = require('mongoose');
const { writeSync } = require("fs");

main().then(() => console.log("connected to DB"))
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(MongoDBUrl);
};

// app.get("/testlisting", async (req, res) => {
//     let sampleListing = new Listing({
//       title: "My New House",
//       description: "Sweet Little Home",
//       price: "12000",
//       location: "Calangute , Goa",
//       country: "India",
//     });
  
//     try {
//       await sampleListing.save();
//       console.log("data saved");
//       res.send("Listing created successfully!"); // Example success message
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Error creating listing"); // Example error message
//     }
//   });

app.use((req,res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//demo user
// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "fakestudent@gmail.com",
//         username: "delta-student",
//     });
//     let regUser = await User.register(fakeUser, "helloworld");
//     res.send(regUser);
// });

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// All routes error handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Custom error handler
app.use((err, req, res, next) => {
    const { statuscode = 500, message = 'Something went wrong' } = err;
    res.status(statuscode).render("error.ejs", { err });
});

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});
