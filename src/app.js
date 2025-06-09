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

connectDb().then(() => {
    console.log("Database connected successfully...")
    app.listen(3000, () => {
        console.log("server is running on port 3000");
    });

}).catch((err) => {
    console.log("Database connection failed...")
})


