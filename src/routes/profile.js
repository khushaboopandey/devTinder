const express = require('express');
const { userAuth } = require("../middlewares/auth")
const profileRouter = express.Router()
// profile Api
profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("User does not exist");
        }
        res.send(user);
    } catch (err) {
        console.error("Caught error:", err);
        res.status(400).send(err.message || "Something went wrong");
    }
});

module.exports = profileRouter
