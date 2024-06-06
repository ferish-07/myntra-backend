const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.DBHOST;

const connectToMongo = async () => {
  await mongoose
    .connect(mongoURL)
    .then(() => {
      console.log("Connection was successfull");
    })
    .catch((err) => console.log("error------------------", err));
};

module.exports = connectToMongo;
