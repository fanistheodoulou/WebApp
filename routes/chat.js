let express = require("express");
let router = express.Router();
let Conversation = require("../models/conversations");
const Message = require('../models/messages');
const path = require('path');

// index
router.get("/", function(req, res){
    let userId = req.user._id;
    let username = req.user.userName;
    Conversation.find({participants: userId}, function(err, allChats){
        if(err){
            console.log(err);
        } else {
            res.render("messaging",{chats:allChats, myUsername:username, messages:[]});
        }
    });
});

router.get("/t/:username", function(req, res){
    let userId = req.user._id;
    let username = req.user.userName;
    Conversation.find({participants: userId}, function(err, allChats){
        if(err){
            console.log(err);
        } else {
            Conversation.find({ $and:[{participants: userId},{usernames: req.params.username}]}, function(err, chat){
                if(err){
                    console.log(err);
                } else {
                    Message.find({chatId: chat}, function(err, allMessages){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("messaging",{chats:allChats, myUsername:username, messages:allMessages, conversation:chat}); //tha allaksei
                        }
                    });
                }
            });
        }
    });
});

router.post("/t/:username", function(req, res){
    let userId = req.user._id;
    let username = req.user.userName;
    let message = req.body.messageText;
    Conversation.find({participants: userId}, function(err, allChats){
        if(err){
            console.log(err);
        } else {
            Conversation.find({ $and:[{participants: userId},{usernames: req.params.username}]}, function(err, chat){
                if(err){
                    console.log(err);
                } else {
                    var now = new Date();
                    var date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
                    var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
                    var dateTime = date+' '+time;

                    let newMessage = {chatId: chat[0]._id, author: userId, authorUsername:username, date:dateTime, message: message};

                    Message.create(newMessage, function(err, newlyCreated){
                        if(err){
                            console.log(err);
                        } else {
                            res.redirect("/chat/t/"+req.params.username);
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
