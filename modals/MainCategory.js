const mongoose = require("mongoose");
const { Schema } = mongoose;

const MainCategorySchema = new Schema({
  category_id: {
    type: Number,
    required: true,
  },
  category_name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("category_master", MainCategorySchema);
