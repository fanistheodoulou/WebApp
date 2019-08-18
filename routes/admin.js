const mongoose = require('mongoose');
const express = require('express');
const methodOverride = require('method-override');
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const { User, validate } = require('../models/users');
const middleware = require("../middleware");
let router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/bid_ya_bid');

router.use(function(req,res,next){
    req.db = db;
    next();
});

router.get('/', middleware.isAdmin, function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    collection.find({},{},function(e,docs){
        res.render('admin/userList', {
            "userList" : docs
        });
    });
});

router.get('/user/:id', middleware.isAdmin, function (req, res, next) {
    User.find({ _id: req.params.id}, function(err, user) {
        if (err){
            console.log(err);
        }else{
            //console.log(user[0]['firstName']);
            res.render('admin/userProfile', { data: user[0]});
        }
    });
    //next();
});

var ObjectID = require('mongodb').ObjectID;

router.put('/user/:id', middleware.isAdmin, function (req, res, next) {
    var myquery = { "_id": ObjectID(req.params.id) };
    var newvalues;
    if(req.body.actionButton == 1)
        newvalues = { $set: {status: "accepted" } };
    else
        newvalues = { $set: {status: "rejected" } };

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://127.0.0.1:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("bid_ya_bid");
        dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
    });
    res.redirect('/admin/user/'+req.params.id);
    //next();
});


module.exports = router;