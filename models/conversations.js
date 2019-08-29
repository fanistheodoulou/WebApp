let mongoose = require("mongoose");


// SCHEMA SETUP
var conversationSchema = new mongoose.Schema({
    participants: [{type: mongoose.Schema.Types.ObjectId}],
    usernames: [{type: String}],
    seller: mongoose.Schema.Types.ObjectId
});


module.exports = mongoose.model("Conversation", conversationSchema);