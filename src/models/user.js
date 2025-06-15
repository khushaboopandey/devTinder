const mongoose = require("mongoose");
let validator = require('validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

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
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email Address" + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Your password is not Strong" + value);
            }
        }
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

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$789", { expiresIn: "7d" });

    return token;
}

userSchema.methods.passwordValidate = async function (PasswordInputByUser) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(PasswordInputByUser, user.password);

    return isPasswordValid;

};

module.exports = mongoose.model("user", userSchema);