require('dotenv').config();
const express = require('express');
const db = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');
const passportMware = require('./config/passport');
const passport = require('passport');
const fetch = require('node-fetch');
const stripe = require('stripe')(process.env.key);
const path = require('path');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const port = process.env.port;
const app = express();
app.use(session({
    // key to encrypt the cookie
    // req.session stores information about that session
     name:'JobPortal',
     secret:'mac',
     saveUninitialized:false,
     resave:false,
     cookie:{
        maxAge:(1000*60*100)
     },
     store: new MongoStore({
        mongoUrl:'mongodb://0.0.0.0/JobPortal'
    }, function(err){
        if (err) {
            console.error("Error setting up MongoStore:", err);
        } else {
            console.log("MongoStore setup successful");
        }
    })
    
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(express.static(path.join(__dirname, 'assets')));
app.use(expressLayouts);
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use('/',require('./routes/index'));

app.listen(port,function(err){
    if(err){
        console.log("error in starting the server");
    }else{
        console.log("server is up and running on port",port);
    }
})