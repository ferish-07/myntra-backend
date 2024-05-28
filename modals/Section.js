const mongoose = require("mongoose");
const { Schema } = mongoose;

const SectionSchema = new Schema({
  section_id: {
    type: Number,
    required: true,
  },
  section_name: {
    type: String,
    required: true,
  },
  category_id: {
    type: Number,
    required: true,
    ref: "category",
  },
  column_no: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("section_master", SectionSchema);
