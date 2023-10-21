const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const countryCodes = {
    "united states": "us",
    "india": "in",
    "united kingdom": "gb",
    "canada": "ca",
    "australia": "au",
    "germany": "de",
    "france": "fr",
    "japan": "jp",
    "china": "cn",
    "brazil": "br",
    "south africa": "za",
    "mexico": "mx",
    "russia": "ru",
    "italy": "it",
    "spain": "es"
  };
  
require('dotenv').config();
router.get('/',passport.checkAuthentication,function(req,res){
    res.render('dashboard-index', {
        title: 'Your Dashboard',
        layout:'../views/dashboard',
        jobResults:"",
    });
})
router.get('/search', async function (req, res) {
    const Job_Title = req.query.job;
    const Location = req.query.location;
    const api_key = process.env.api_key;
    const app_id = process.env.app_id
    const countryCode = countryCodes[Location.toLowerCase()];
    const adzunaBaseUrl = 'https://api.adzuna.com/v1/api/jobs/';

    try {
        if (!countryCode) {
            return res.status(400).send('Invalid location or country.');
        }
        const fullURL = `${adzunaBaseUrl}${countryCode}/search/1?app_id=${app_id}&app_key=${api_key}&title_only=${Job_Title}&results_per_page=50`;
        const response = await fetch(fullURL);

        if (response.status === 200) {
            const jobResults = await response.json();
            res.render('dashboard-index', {
                title: 'Your Dashboard',
                layout: '../views/dashboard',
                jobResults: jobResults.results // Assuming results is the array in the API response
            });
        } else {
            res.status(response.status).send('Failed to fetch job data.');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
