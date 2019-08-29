let express = require("express");
let router = express.Router();
let Item = require("../models/items");
const Users = require('../models/users');
const Categories = require('../models/categories');
const path = require('path');

router.get("/", function(req, res){

    Categories.find({}, function(err, allCategories){
        if(err){
            console.log(err);
        } else {
            if(req.query.searchTerm){
                Item.find({name: req.query.searchTerm}, function(err, allItems){
                    if(err){
                        console.log(err);
                    } else {
                        res.render("search",{categories:allCategories, items:allItems, searchQuery:"?searchTerm="+req.query.searchTerm});
                    }
                });
            }
            else{
                Item.find({'status':1}, function(err, allItems){
                    if(err){
                        console.log(err);
                    } else {
                        res.render("search",{categories:allCategories, items:allItems, searchQuery:""});
                    }
                });
            }
        }
    });

});

router.post("/", function(req , res){


    let searchValue = req.body.myinput;
    let categoriesValue = req.body.category;
    let priceLowValue = req.body.PRfrom;
    let priceHighValue = req.body.PRfrom;
    let locationValue = req.body.location;

    Categories.find({}, function(err, allCategories){
        if(err){
            console.log(err);
        } else {
            if(searchValue){
                res.redirect('/search?searchTerm='+searchValue);
            }
            else{

                var q = {};
                q['$and']=[];
                if(categoriesValue){
                    q["$and"].push({ category: {$in: categoriesValue/*.split(",")*/ }});
                }
                if(locationValue){
                    q["$and"].push({ location: locationValue });
                }
                if(priceLowValue){
                    q["$and"].push({ price: { $gt: priceLowValue }});
                }
                if(priceHighValue){
                    q["$and"].push({ price: { $lt: priceHighValue }});
                }

                console.log(q);

                if(req.query.searchTerm){
                    console.log(req.query.searchTerm);
                    Item.find( q , function(err, allItems){
                        if(err){
                            console.log(err);
                        } else {
                            console.log(allItems);
                            res.render("search",{categories:allCategories, items:allItems, searchQuery:"?searchTerm="+req.query.searchTerm});
                        }
                    });
                }
                else{
                    Item.find( q, function(err, allItems){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("search",{categories:allCategories, items:allItems, searchQuery:""});
                        }
                    });
                }
            }

        }
    });

});


module.exports = router;