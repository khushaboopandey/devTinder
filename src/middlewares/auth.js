const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            throw new Error("Invalid Token");
        }

        let decodeMessage;
        try {
            decodeMessage = jwt.verify(token, "DEV@Tinder$789");
        } catch (err) {
            throw new Error("Invalid or expired token");
        }

        const { _id } = decodeMessage;

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User does not exist");
        }
        req.user = user;
        next()
    } catch (err) {
        console.error("Caught error:", err);
        res.status(400).send(err.message || "Something went wrong");
    }
}

module.exports = { userAuth }