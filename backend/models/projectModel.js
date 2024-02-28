const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    comment: { type: String, required: true },
  },

  { timestamps: true }
);
const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    assigned_to: { type: Array, default: [] },
    status: {
      type: String,
      default: "Not complete",
      enum: ["Not complete", "Completed"],
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
