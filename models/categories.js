let mongoose = require("mongoose");

// SCHEMA SETUP
let categorySchema = new mongoose.Schema({
    name: String,
    displayName: String,
    parent: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        name: String
    },
    ancestors: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category"
            },
            name: String
        }
    ]

});

module.exports = mongoose.model("Category", categorySchema);