const express = require('express')
const connectDb = require('./config/database')
const User = require('./models/user');
const app = express();

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "khush",
        lastName: "pandey",
        emailId: "khush@example.com",
        password: "password123",
        age: "25",
        number: "1234567890"
    })
    try {
        await user.save();
        res.send("User registered successfully")
    } catch (err) {
        console.log(err);
        res.status(400).send("Error Saving the User : " + err.message);
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


