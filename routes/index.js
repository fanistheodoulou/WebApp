const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const passport = require("passport");
const { User, validate } = require('../models/users');
const Item = require('../models/items');
const Bid = require('../models/bids');
const middleware = require("../middleware");
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);



router.get('/', function(req, res) {
    req.flash('logged', null);
    res.render('index');
});

router.post('/', passport.authenticate("local", {failureRedirect: "/"}) ,function(req, res){
    if(req.user.type == 'admin'){
        res.redirect('/admin');
    }
    else{
        if(req.user.status == 'pending'){
            req.flash('logged', 'Your account needs to be accepted by the page admin.');
            res.render('index')
        }
        else if(req.user.status == 'rejected'){
            req.flash('logged', 'Your account has been rejected by the page admin.');
            res.render('index')
        }
        else{
            res.redirect('/home');
        }
    }
});



router.get('/register', function(req, res) {
    res.render('register', {
        usernameVal : '',
        firstnameVal: '',
        lastnameVal: '',
        emailVal: '',
        birthdateVal: '',
        phoneVal: '',
        vatVal: '',
        locationVal: '',
        unErMsg : false,
        emErMsg : false,
        passErMsg : false,
        cpErMsg : false,
        phErMsg : false
    });
});



router.post('/register', async (req, res) => {

    var usernameVal = req.body.userName;
    var firstnameVal= req.body.firstName;
    var lastnameVal= req.body.lastName;
    var emailVal= req.body.email;
    var birthdateVal= req.body.birthDate;
    var phoneVal= req.body.phone;
    var vatVal= req.body.vat;
    var locationVal= req.body.location;
    var unErMsg = false;
    var emErMsg = false;
    var passErMsg = false;
    var cpErMsg = false;
    var phErMsg = false;

    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        for(var er = 0; er < error.details.length; er++){
            console.log(error.details[er].message);
            if(error.details[er].message.includes('userName')){
                usernameVal = '';
                unErMsg = true;
            }
            if(error.details[er].message.includes('phone')){
                phoneVal = '';
                phErMsg = true;
            }
            if(error.details[er].message.includes('password')){
                passErMsg = true;
            }
        }
        //return res.status(400).send(error.details[0].message);
        res.render('register', {
            usernameVal : usernameVal,
            firstnameVal: firstnameVal,
            lastnameVal: lastnameVal,
            emailVal: emailVal,
            birthdateVal: birthdateVal,
            phoneVal: phoneVal,
            vatVal: vatVal,
            locationVal: locationVal,
            unErMsg : unErMsg,
            emErMsg : emErMsg,
            passErMsg : passErMsg,
            cpErMsg : cpErMsg,
            phErMsg : phErMsg
        });
    }

    //  checking if passwords match
    if(req.body.password != req.body.passwordComfirm){
        cpErMsg = true;
    }

    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        //return res.status(400).send('That email already exisits!');

        emailVal = '';
        emErMsg = true;
        res.render('register', {
            usernameVal : usernameVal,
            firstnameVal: firstnameVal,
            lastnameVal: lastnameVal,
            emailVal: emailVal,
            birthdateVal: birthdateVal,
            phoneVal: phoneVal,
            vatVal: vatVal,
            locationVal: locationVal,
            unErMsg : unErMsg,
            emErMsg : emErMsg,
            passErMsg : passErMsg,
            cpErMsg : cpErMsg,
            phErMsg : phErMsg
        });

    } else {
        let user = await User.findOne({ userName: req.body.userName });
        if (user) {
            //return res.status(400).send('That username already exisits!');
            unErMsg = true;
            usernameVal = '';
            res.render('register', {
                usernameVal : usernameVal,
                firstnameVal: firstnameVal,
                lastnameVal: lastnameVal,
                emailVal: emailVal,
                birthdateVal: birthdateVal,
                phoneVal: phoneVal,
                vatVal: vatVal,
                locationVal: locationVal,
                unErMsg : unErMsg,
                emErMsg : emErMsg,
                passErMsg : passErMsg,
                cpErMsg : cpErMsg,
                phErMsg : phErMsg
            });
        }
        else{
            // Insert the new user if they do not exist yet
            user = new User({
                userName: req.body.userName,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                birthDate: req.body.birthDate,
                vat: req.body.vat,
                location: req.body.location,
                status: 'pending',
                type: 'user',
            });
            await User.register(user, req.body.password, function(err, user){
                if(err){
                    console.log(err);
                    //return res.render('register');
                }
                passport.authenticate("local")(req, res, function(){
                    console.log('User registered sucessfuly!');
                    req.flash('logged', null);
                    res.redirect("/");
                });
            });

        }
    }
});

router.get("/home",middleware.isLoggedIn, function(req, res){
    res.render('home');
});


router.get('/logout', middleware.isLoggedIn, function(req, res){
    req.logout();
    req.flash('logged', null);
    res.redirect('/');
});


// router.get("/search", middleware.isLoggedIn, function(req, res){
//     Item.find({'status':1}, function(err, allItems){
//         if(err){
//             console.log(err);
//         } else {
//             res.render("item", {items:allItems});
//         }
//     });
// });
//
// router.post("/search", middleware.isLoggedIn, function(req, res){
//     ////find the item
//     // Item.findById(req.body.itemid, function(err, item){
//     //     if(err){
//     //         console.log(err);
//     //         res.redirect("/search");
//     //     }
//     //     else{
//     //         Bid.create(req.body.quantity, function(err, bid){
//     //             if(err){
//     //                 console.log(err);
//     //             }
//     //             else{
//     //                 bid.bidder.id = req.user._id;
//     //                 bid.bidder.username = req.user.userName;
//     //                 bid.bidder.location = req.user.location;
//     //                 bid.save();
//     //                 item.bids.push(bid);
//     //                 item.save();
//     //                 res.redirect('/search');
//     //             }
//     //         });
//     //     }
//     // });
//     let bidder = {
//         id: req.user._id,
//         username: req.user.userName,
//         location: req.user.location
//     };
//     let newBid = {amount: req.body.quantity, bidder: bidder};
//     Bid.create(newBid, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         } else {
//             //redirect back to management page
//             Item.findById(req.body.itemid, function (err, item) {
//                 if (err) {
//                     console.log(err);
//                     res.redirect("/search");
//                 }
//                 else {
//                     item.bids.push(newlyCreated);
//                     item.currently = req.body.quantity;
//                     item.numberOfBids += 1;
//                     item.save();
//                     console.log(req.body.itemid);
//                     res.redirect('/search');
//                 }
//             });
//         }
//     });
//
// });


module.exports = router;