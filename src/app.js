const express = require('express')
const app = express();

app.use("/test", (req, res) => {
    res.send("hello from server")
})

app.use("/hello", (req, res) => {
    res.send("hello hello")
})

app.listen(8888, () => {
    console.log("server is running on port 3000");
});
