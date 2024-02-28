const jwt = require("jsonwebtoken");
const createError = require("http-errors");
require("dotenv").config();
const Token = require("../models/tokenModel");

// Function returning promise
exports.signAccessToken = (userObj) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userObj },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" },
      (err, token) => {
        if (err) {
          console.log(err);
          return reject(createError.InternalServerError());
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return resolve({ token, exp: decoded.exp });
      }
    );
  });
};

// Function returning promise
exports.signRefreshToken = (userObj) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userObj },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
      async (err, token) => {
        if (err) {
          console.log(err);
          return reject(createError.InternalServerError());
        }

        //push refresh token to DB for storage
        try {
          await Token.create({ token });
        } catch (err) {
          return reject(createError.InternalServerError());
        }

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        return resolve({ token, exp: decoded.exp });
      }
    );
  });
};

// Middleware
exports.verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) return next(createError.Unauthorized());
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      console.log(err);
      console.log("Token expired!");
      const message =
        err.name === "TokenExpiredError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
};

// Function returning promise
exports.verifyRefreshToken = async (refreshToken) => {
  console.log("current refreshToken: " + refreshToken);
  // console.log("refreshTokens: " + refreshTokens);
  try {
    const tokenExistsObj = await Token.find({ token: refreshToken });
    console.log(tokenExistsObj);

    if (!refreshToken || tokenExistsObj.length === 0) {
      throw createError.Unauthorized();
    }

    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError.InternalServerError());
          return resolve({ user: payload.user });
        }
      );
    });
  } catch (err) {
    return reject(createError.InternalServerError());
  }
};

exports.refreshTokens = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userDetails = await this.verifyRefreshToken(refreshToken);
    const accessTokenData = await this.signAccessToken(userDetails);
    const refreshTokenData = await this.signRefreshToken(userDetails);
    res.json({ accessTokenData, refreshTokenData });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

// Controller
exports.deleteRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    Token.deleteOne({ token: refreshToken }, function (err) {
      if (err) console.log(err);
      console.log("Successful deletion");
    });

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.admin = (req, res, next) => {
  if (req.payload.user && req.payload.user.admin) {
    next();
  } else {
    res.status(401).json({ error: "Not authorised as admin." });
  }
};
