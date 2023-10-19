const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
require('dotenv').config();
router.get('/',passport.checkAuthentication,function(req,res){
    res.render('dashboard-index', {
        title: 'Your Dashboard',
        layout:'../views/dashboard'
    });
})
router.get('/search', async function (req, res) {
    const searchQuery = req.query.job; // Use req.query to access query parameters
    const api_token = process.env.token;
    const api_url = 'https://jobs.github.com/positions.json';
    const fullURL = `${api_url}?description=${searchQuery}`;
    const response = await fetch(fullURL,{
        headers:{
            Authorization:`Bearer${api_token}`
        }
    })
    if(response.staus === 200){
        const jobResults = await response.json();
        return res.json(jobResults);
    }else{
        res.status(response.status).send('Failed to fetch job data.');
    }
  });
  
module.exports = router;
