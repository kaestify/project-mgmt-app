const mongoose = require("mongoose");
const tokenSchema = mongoose.Schema(
  {
    token: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
