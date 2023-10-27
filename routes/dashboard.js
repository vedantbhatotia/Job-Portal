const express = require('express');
const router = express.Router();
const passport = require('passport');
const customMiddleware = require('../config/custom_middleware');
const countryList = require('country-list');
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
router.get('/search',passport.checkAuthentication,async function (req, res) {
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
        const fullURL = `${adzunaBaseUrl}${countryCode}/search/1?app_id=${app_id}&app_key=${api_key}&title_only=${Job_Title}&results_per_page=40`;
        const response = await fetch(fullURL);

        if (response.status === 200) {
            const jobResults = await response.json();
            res.render('dashboard-index', {
                title: 'Your Dashboard',
                layout: '../views/dashboard',
                jobResults: jobResults.results})
        } else {
            res.status(response.status).send('Failed to fetch job data.');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
    }
});
router.get('/get-news',customMiddleware.check,function(req,res){
   return res.render('news-letter',{
    title:'News Letter Page',
    layout:'../views/news-letter-layout',
    NewsResults:"",
    extractedDate:"",
   })
})
router.get('/search-news',customMiddleware.check,async function(req,res){
    const location = req.query.location;
    const api_key = process.env.news_key;
    const country_code = countryCodes[location.toLowerCase()];
    if (country_code) {
        const lowercaseIsoCode = country_code.toLowerCase();
        const fullURL =  `https://newsapi.org/v2/top-headlines?country=${lowercaseIsoCode}&category=technology&apiKey=2e3c3fe1d98b4d5690f981a46dcacdf3`
        const response = await fetch(fullURL);
        if(response.status === 200){
            const news_results = await response.json();
            res.render('news-letter', {
                title: 'News',
                layout: '../views/news-letter-layout',
                NewsResults: news_results.articles,
            });
        }
      } else {
        console.log(`Country not found`);
    }
})
module.exports = router;
