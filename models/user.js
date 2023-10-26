const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({  
    username:{
        type:String,
        required:true
    },
    googleID:{
        type:String,
        required:true
    },
    isSubscribed:{
        type: Boolean,
        default: false 
    }
},{
    timestamps:true
});
const User = mongoose.model('User',UserSchema);
module.exports = User