const mongoose = require("mongoose");
const { Schema } = mongoose;

const Token = new Schema({
  user_id: {
    type: Number,
    ref: "user",
    required: true,
  },
  auth_token: { type: String, required: true },
  user_name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("token", Token);
