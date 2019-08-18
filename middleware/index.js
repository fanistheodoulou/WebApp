let User = require("../models/users");
let Item = require("../models/items");


let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('logged', null);
    res.redirect('/');
}

//////
middlewareObj.isAdmin = function (req, res, next) {
    if(req.user){
        if (req.isAuthenticated && req.user.type == 'admin')
            return next();
        res.send(401, 'Unauthorized');
    }
    req.flash('logged', null);
    res.redirect('/');
}

module.exports = middlewareObj;