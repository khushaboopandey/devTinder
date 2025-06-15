const express = require('express')
const connectDb = require('./config/database')
const User = require('./models/user');
var cookieParser = require('cookie-parser');
const app = express();
// Enable cookie parser middleware
app.use(cookieParser()); // middleware
app.use(express.json());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)


connectDb().then(() => {
    console.log("Database connected successfully...")
    app.listen(3000, () => {
        console.log("server is running on port 3000");
    });

}).catch((err) => {
    console.log("Database connection failed...")
})


