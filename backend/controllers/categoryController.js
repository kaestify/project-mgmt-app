const Category = require("../models/categoryModel");

//get all categories
exports.read = async (req, res) => {
  const categories = await Category.find({});
  if (categories) {
    res.send(categories);
  } else {
    res.status(404).json({ error: "Error fetching categories." });
  }
};
