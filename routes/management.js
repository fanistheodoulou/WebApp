let express = require("express");
let router = express.Router();
let Item = require("../models/items");
const Categories = require('../models/categories');

let schedule = require('node-schedule');

// const Users = require('../models/users');
const multer = require('multer');
const path = require('path');





//////////////////////////////////////////////////////////////////////
// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 100000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: Images Only!');
    }
}
//////////////////////////////////////////////////////////////////////


// router.get("/", function(req, res){
//     res.render("landing");
// });

//////INDEX
router.get("/", function(req, res){
    // Get all campgrounds from DB
    let userId = req.user._id;
    Item.find({"seller.id":userId}, function(err, allItems){
        if(err){
            console.log(err);
        } else {
            res.render("management",{items:allItems});
        }
    });
});


/////NEW
router.get("/new", function(req, res){
    Categories.find({}, function(err, allCategories){
        if(err){
            console.log(err);
        } else {
            res.render("new",{categories:allCategories});
        }
    });
});


////CREATE
router.post("/", function(req, res){

    upload(req, res, (err) => {
        if(err){
            res.redirect("/management")
        } else {
            if(req.file == undefined){
                res.redirect('/new');
            } else {
                let name = req.body.name;
                let image = `uploads/${req.file.filename}`;
                let category = [req.body.category];
                if(req.body.subcategory)
                    category.push(req.body.subcategory);
                if(req.body.subcategory2)
                    category.push(subcategory2);
                let description = req.body.description;
                let seller = {
                    id: req.user._id,
                    username: req.user.userName
                };
                let started = (new Date(req.body.startDate + " " + req.body.startTime));
                let ends = (new Date(req.body.endDate + " " + req.body.endTime));
                let newItem = {name: name, image: image, description: description, category: category, seller: seller, started: started, ends: ends};

                Item.create(newItem, function(err, newlyCreated){
                    if(err){
                        console.log(err);
                    } else {
                        //////CHRON
                        var j = schedule.scheduleJob(started, function(){
                            console.log('The world is going to start today. ' + name);
                            newlyCreated.status = 1;
                            newlyCreated.save();
                        });
                        //////CHRON
                        var x = schedule.scheduleJob(ends, function(){
                            console.log('The world is going to end today. ' + name);
                            newlyCreated.status = 2;
                            newlyCreated.save();
                        });
                        //redirect back to management page
                        res.redirect("/management");
                    }
                });
            }
        }
    });




    // if(req.file == undefined){
    //     console.log("HERE");
    //     res.redirect('/new');
    //         // msg: 'Error: No File Selected!'
    // }
    // else{
    //     let name = req.body.name;
    //     let image = `uploads/${req.file.filename}`;
    //     let description = req.body.description;
    //     console.log(name, image, description);
    //     // let author = {
    //     //     id: req.user._id,
    //     //     username: req.user.username
    //     // };
    //
    //     let newItem = {name: name, image: image, description: description};
    //
    //     Item.create(newItem, function(err, newlyCreated){
    //         if(err){
    //             console.log(err);
    //         } else {
    //             //redirect back to management page
    //             res.redirect("/management");
    //         }
    //     });
    // }


});


////SHOW
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Item.findById(req.params.id, function(err, foundItem){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("show", {item: foundItem});
        }
    });
});




module.exports = router;