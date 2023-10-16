// require the library
const mongoose = require('mongoose');
// connect to the database
mongoose.connect('mongodb://0.0.0.0/JobPortal');
// get the connection bw mongoose and database
const db = mongoose.connection;
// check if the connection is made or not
db.on('error',console.error.bind(console,"error connecting to db"));
db.once('open',function(){
    console.log("successfully connected to the database");
});
module.exports = db;