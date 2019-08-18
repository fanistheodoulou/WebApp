const Joi = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: 'This field is required.',
        unique: true
    },
    firstName: {
        type: String,
        //required: 'This field is required.'
    },
    lastName: {
        type: String,
        //required: 'This field is required.'
    },
    email: {
        type: String,
        required: 'This field is required.',
        unique: true
    },
    phone: {
        type: String,
        //required: 'This field is required.'
    },
    password: {
        type: String,
    },
    birthDate: {
        type: Date,
        //required: 'This field is required.'
    },
    vat: {
        type: String,
        //required: 'This field is required.'
    },
    location: {
        type: String,
        //required: 'This field is required.'
    },
    status: {
        type: String,
    },
    type: {
        type: String,
    },
})

UserSchema.plugin(passportLocalMongoose, { usernameField : 'userName' });

const User = mongoose.model('User', UserSchema);


function validateUser(user) {
    const schema = {
        userName: Joi.string().min(5).max(50).required(),
        firstName: Joi.string().min(1).max(255).required(),
        lastName: Joi.string().min(1).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        phone: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(8).max(255).required(),
        passwordComfirm: Joi.allow(),
        birthDate: Joi.date().required(),
        vat: Joi.string().min(1).max(255).required(),
        location: Joi.string().min(1).max(255).required(),
        submit: Joi.allow()
    };
    return Joi.validate(user, schema, { abortEarly: false });
}

exports.User = User;
exports.validate = validateUser;