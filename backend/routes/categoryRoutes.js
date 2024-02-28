const express = require("express");
const router = express.Router();
const { read } = require("../controllers/categoryController");

router.get("/getallcategories", read);

module.exports = router;
