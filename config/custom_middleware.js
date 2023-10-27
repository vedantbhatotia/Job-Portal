const user = require('../models/user');
module.exports.check = function(req,res,next){
    const user = req.user;
    if(user. isSubscribed){
        return next();
    }else{
        return res.redirect('back');
    }
}