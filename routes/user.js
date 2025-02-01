const express = require("express");
const router = express.Router({mergeParams : true});
const User = require("../models/users.js");
const wrapAsyc = require("../utlis/wrapAsyc.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers = require("../controllers/users.js")

// signup
router.get("/signup", userControllers.signupForm);

router.post("/signup", wrapAsyc(userControllers.userSignup));



// login
router.get("/login", userControllers.loginForm);

router.post("/login", 
    saveRedirectUrl, 
    passport.authenticate('local', { 
        failureRedirect: '/login', 
        failureFlash: true 
    }), 
    userControllers.userLogin
);


router.get("/logout", userControllers.logout);

module.exports = router;