const mongoose = require("mongoose");
const { Schema } = mongoose;

const BrandSchema = new Schema({
  brand_id: {
    type: Number,
    required: true,
  },
  brand_name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("brand_master", BrandSchema);
