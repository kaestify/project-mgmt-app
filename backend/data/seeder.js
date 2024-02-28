const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("../config/db");
const Category = require("../models/categoryModel");
const categories = require("./categories");

connectDB();

const importData = async () => {
  try {
    await Category.deleteMany();
    await Category.insertMany(categories);
    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Category.deleteMany();
    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
