let mongoose = require("mongoose");

// SCHEMA SETUP
let bidSchema = new mongoose.Schema({
    amount: Number,
    bidder: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        location: String
    },
    time: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bid", bidSchema);