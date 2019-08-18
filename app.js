let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let passport = require("passport");
const multer = require('multer');
const path = require('path');
let localStrategy = require("passport-local");
const flash = require('express-flash');
const methodOverride = require('method-override');
let Item = require("./models/items");
const { User, validate } = require('./models/users');


//requring routes
let managementRoutes      = require("./routes/management");
let adminRoutes           = require("./routes/admin");
let indexRoutes           = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/bid_ya_bid", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(flash());

app.use(require("express-session")({
    secret: "santa",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride("_method"));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


app.use("/management", managementRoutes);
app.use("/admin", adminRoutes);
app.use("/", indexRoutes);







app.listen(4000, function() {
    console.log('Server listening on port 4000');
});

