const mongoose = require("mongoose");

const mongoURL =
  "mongodb+srv://modiferish:Ferish123@ferish.ol6gmp9.mongodb.net/Myntra";

const connectToMongo = async () => {
  await mongoose
    .connect(mongoURL)
    .then(() => {
      console.log("Connection was successfull");
    })
    .catch((err) => console.log("error------------------", err));
};

module.exports = connectToMongo;
