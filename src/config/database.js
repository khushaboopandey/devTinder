const mongoose = require("mongoose");
const connectDb = async () => {
    await mongoose.connect("mongodb+srv://node:Z8LZRCQBYzhrTLvJ@node.frb4rqw.mongodb.net/devTinder");
}

module.exports = connectDb;