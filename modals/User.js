const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true,
    immutable: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_category: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("user", UserSchema);
