const mongoose = require("mongoose");
const { Schema } = mongoose;

const CounterSchema = new Schema({
  unique_id: Number,
  sequence_value: Number,
  category_id: Number,
  section_id: Number,
  sub_section_id: Number,
  brand_id: Number,
});

module.exports = mongoose.model("counters", CounterSchema);
