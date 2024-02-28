const express = require("express");
const router = express.Router();

const {
  refreshTokens,
  verifyAccessToken,
  deleteRefreshToken,
  admin,
} = require("../helpers/jwtHelpers");

const {
  login,
  register,
  getAllUsers,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.post("/refresh-tokens", verifyAccessToken, refreshTokens);
router.post("/delete-refresh-token", verifyAccessToken, deleteRefreshToken);
router.get("/getallusers", verifyAccessToken, getAllUsers);
module.exports = router;
