const mongoose = require("mongoose");
let validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: { type: String },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail) {
                throw new Error("Invalid Email Address" + value);
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    number: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 10
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender Data Not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://fastly.picsum.photos/id/729/536/354.jpg?hmac=2w_Fr-PmHejgKkQutSxtALszyq2aSwHUw2HajRvw7t0",
        validate(value) {
            if (!validator.isURL) {
                throw new Error("Invalid Photo Url" + value);
            }
        }

    },
    about: {
        type: String,
        default: "This is a default about of the user!"
    }, skills: {
        type: [String]
    }

}, { timestamps: true })

module.exports = mongoose.model("user", userSchema);