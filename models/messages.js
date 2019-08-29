let mongoose = require("mongoose");


var messageSchema = new mongoose.Schema({
    chatId: mongoose.Schema.Types.ObjectId,
    author: mongoose.Schema.Types.ObjectId,
    authorUsername: String,
    date: Date,
    message: String
});


module.exports = mongoose.model("Message", messageSchema);