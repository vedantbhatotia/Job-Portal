const passport = require('passport');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Corrected require statement
const keys = require('../config/keys');

passport.use(new GoogleStrategy({
    // options for google strategy
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,  // Accessing clientID under the google object
    clientSecret: keys.google.clientSecret 
}, async function (accessToken, refreshToken, profile, done) {
    let user = await User.findOne({ googleID: profile.id });
    if (user) {
        console.log("User already exists in the database", user);
        done(null, user);
    } else {
        const newUser = new User({
            username: profile.displayName,
            googleID: profile.id
        });
        await newUser.save();
        console.log(newUser);
        done(null, newUser);
    }
}));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
    try {
        let user = await User.findById(id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        console.log("Error:", err);
        return done(err);
    }
});
passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        return res.redirect('/');
    }
}
passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    return next();  // Make sure to always call next()
};


module.exports = passport;