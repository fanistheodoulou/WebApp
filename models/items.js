let mongoose = require("mongoose");

// SCHEMA SETUP
var itemSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    location: String,
    buyPrice: Number,
    started: { type: Date, default: Date.now },
    seller: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Item", itemSchema);