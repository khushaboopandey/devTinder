const express = require('express')
const connectDb = require('./config/database')
const User = require('./models/user');
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save();
        res.send("User registered successfully")
    } catch (err) {
        console.log(err);
        res.status(400).send("Error Saving the User : " + err.message);
    }

})

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





connectDb().then(() => {
    console.log("Database connected successfully...")
    app.listen(3000, () => {
        console.log("server is running on port 3000");
    });

}).catch((err) => {
    console.log("Database connection failed...")
})


