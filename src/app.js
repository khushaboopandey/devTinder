const express = require('express')
const connectDb = require('./config/database')

const app = express();


connectDb().then(() => {
    console.log("Database connected successfully...")
    app.listen(3000, () => {
        console.log("server is running on port 3000");
    });

}).catch((err) => {
    console.log("Database connection failed...")
})


