// Database Posts Schema
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  cname: { type: String, required: true, unique:true }
});

module.exports = mongoose.model("Category", CategorySchema);
