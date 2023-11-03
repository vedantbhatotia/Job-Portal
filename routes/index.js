const express = require('express');
const router = express.Router();
const passport = require('passport');
const stripe = require('stripe')(process.env.key);
// all the base routes will be handled by this file and all the user specific routes will be handled by the users.js routes
function custom(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        return res.redirect('/auth/google');
    }
}
router.post('/create-checkout-session',custom,async (req, res) => {
    try {
        const { price_id } = req.body;
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [{
                price: 'price_1O4jBFSEuhAtBLixkYN2e5Jf',
                quantity: 1,
            }],
            success_url:'http://localhost:8000/success',
            cancel_url: 'http://localhost:8000/failure',
        });
        const user = req.user;
        user.isSubscribed = true;
        await user.save();
        res.redirect(303, session.url);
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send('Internal server error');
    }
});
router.get('/success',function(req, res) {
    try {
        const user = req.user;

        if (user.isSubscribed) {
            return res.send(`Welcome, ${user.username}! Payment successful.`);
        } else {
            return res.status(403).send('Unauthorized: Payment status is not valid.');
        }
    } catch (error) {
        console.error('Error checking payment status:', error);
        res.status(500).send('Internal server error');
    }

});

router.get('/failure',function(req,res){
    return res.send("sorry payment failed");
})
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
    return res.redirect('/dashboard');
})
router.get('/logout',passport.checkAuthentication,function(req,res){
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.redirect('/'); // Handle error by redirecting to home or appropriate page
        }
        return res.redirect('/');
    });
})
router.use('/dashboard',require('./dashboard'));
module.exports = router;