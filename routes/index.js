const express = require('express');
const router = express.Router();
const passport = require('passport');
// all the base routes will be handled by this file and all the user specific routes will be handled by the users.js routes
router.get('/',function(req,res){
    res.render('home-page',{
        title:'JOBIFY'
    });
})
router.get('/auth/google',passport.authenticate('google',{
    scope:['profile']
}))
router.get('/auth/google/redirect',passport.authenticate('google'),function(req,res){
    // return res.redirect('/dashboard');
    res.send("reached");
})
module.exports = router;