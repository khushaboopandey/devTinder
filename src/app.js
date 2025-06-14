const express = require('express')
const bcrypt = require('bcrypt');
const connectDb = require('./config/database')
const User = require('./models/user');
var cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken');
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
        if (!user) {
            throw new Error("Email Id not present in db");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {
            // Create a JWT Token
            const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$789");
            res.cookie("token", token);
            res.send("Login SuccessFull!!!");
        } else {
            throw new Error("Password is not Correct");
        }
    } catch (err) {
        res.status(400).send("Something went wrong", err.message);
    }
})

// profile Api
app.get("/profile", async (req, res) => {
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

        const loggedInUser = await User.findById(_id);
        if (!loggedInUser) {
            throw new Error("User does not exist");
        }
        res.send(loggedInUser);
    } catch (err) {
        console.error("Caught error:", err);
        res.status(400).send(err.message || "Something went wrong");
    }
});


// get user by email
app.post("/user", async (req, res) => {
    const userEmail = req.body.emailId
    try {
        const users = await User.find({ emailId: userEmail })
        if (users.length === 0) {
            res.status(404).send("User Not found")
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Something went wrong")
    }
})

// Feed Api - GET/Feed - get all the users from the db
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (err) {
        res.status(400).send("Something went wrong")
    }
})

// Delete a user from db
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId)
        res.send("users deleted Successfully")
    } catch (err) {
        res.status(400).send("Something went wrong")
    }
})

// Update the data of user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }

        if (data.skills && data.skills.length > 10) {
            throw new Error("Skills can not be more than 10");
        }

        const user = await User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send("User updated successfully");
    } catch (err) {
        console.error(err);
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


