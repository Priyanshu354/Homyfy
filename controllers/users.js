const User = require("../models/users");

module.exports.signupForm = (req, res) =>{
    res.render("users/signup.ejs");
};

module.exports.userSignup = async (req, res) => {
    try{
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        //console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "User registered successfully!");
            res.redirect("/listings");
        });
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
};

module.exports.loginForm = (req, res) =>{
    res.render("users/login.ejs");
};

module.exports.userLogin = async (req, res) => {
    req.flash("success", "Welcome back!");
    if(res.locals.redirectUrl) res.redirect(res.locals.redirectUrl);
    else res.redirect("/listings");
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    })
};