const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubSectionSchema = new Schema({
  sub_section_id: {
    type: Number,
    required: true,
  },
  sub_section_name: {
    type: String,
    required: true,
  },
  section_id: {
    type: Number,
    required: true,
    ref: "section",
  },
});

module.exports = mongoose.model("sub_section_master", SubSectionSchema);
