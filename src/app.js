const express = require('express')
const bcrypt = require('bcrypt');
const connectDb = require('./config/database')
const User = require('./models/user');
var cookieParser = require('cookie-parser')
const { userAuth } = require("./middlewares/auth")
const { validateSignUpData } = require('./utils/validation');

const app = express();
// Enable cookie parser middleware
app.use(cookieParser()); // middleware
app.use(express.json());

app.post("/signup", async (req, res) => {

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

app.post("/login", async (req, res) => {
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

// profile Api
app.get("/profile", userAuth, async (req, res) => {
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

connectDb().then(() => {
    console.log("Database connected successfully...")
    app.listen(3000, () => {
        console.log("server is running on port 3000");
    });

}).catch((err) => {
    console.log("Database connection failed...")
})


