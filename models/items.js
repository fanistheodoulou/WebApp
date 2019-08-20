let mongoose = require("mongoose");

// SCHEMA SETUP
let itemSchema = new mongoose.Schema({
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
    },
    bids: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bid"
        }
    ]
});

module.exports = mongoose.model("Item", itemSchema);