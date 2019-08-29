let mongoose = require("mongoose");

// SCHEMA SETUP
let itemSchema = new mongoose.Schema({
    name: String,
    image: String,
    category: [{type:String}],
    description: String,
    location: String,
    buyPrice: Number,
    started: { type: Date, default: Date.now },
    ends: Date,
    seller: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    numberOfBids: {type: Number, default: 0},
    currently: {type: Number, default: 0},
    bids: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bid"
        }
    ],
    status: {type: Number, default: 0}
});

module.exports = mongoose.model("Item", itemSchema);