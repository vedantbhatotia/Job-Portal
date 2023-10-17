const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
router.get('/',passport.checkAuthentication,function(req,res){
    res.render('dashboard-index', {
        title: 'Your Dashboard',
        layout:'../views/dashboard'
    });
})
module.exports = router;
