const express = require('express')
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { validateSignUpData } = require('../utils/validation');
const authRouter = express.Router();


authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const { firstName, lastName, emailId, password, number } = req.body;
        // encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, emailId, number, password: passwordHash })
        await user.save();
        res.send("User registered successfully")
    } catch (err) {
        console.log(err);
        res.status(400).send("Error Saving the User : " + err.message);
    }

})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId })
        // console.log("user" + user)
        if (!user) {
            throw new Error("Email Id not present in db");
        }
        const isPasswordValid = await user.passwordValidate(password)
        if (isPasswordValid) {
            const token = await user.getJWT();
            // Create a JWT Token
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
            res.send("Login SuccessFull!!!");
        } else {
            throw new Error("Password is not Correct");
        }
    } catch (err) {
        res.status(400).send("Something went wrong", err.message);
    }
})



module.exports = authRouter;