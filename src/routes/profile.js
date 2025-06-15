const express = require('express');
const { userAuth } = require("../middlewares/auth")
const { validateEditProfileData } = require('../utils/validation');
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])
        await loggedInUser.save()
        res.json({
            message: `${loggedInUser.firstName} Profile updated SuccessFully!`,
            data: loggedInUser
        });

    } catch (err) {
        console.error("Caught error:", err);
        res.status(400).send(err.message || "Something went wrong");
    }
})

module.exports = profileRouter
