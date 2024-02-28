const { signAccessToken, signRefreshToken } = require("../helpers/jwtHelpers");
const User = require("../models/userModel");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: "User with that email not found." });
  }

  if (user && (await user.matchPassword(password))) {
    let userDetails = {
      userId: user._id,
      userName: user.username,
      admin: user.admin,
    };
    const accessTokenData = await signAccessToken({
      userDetails,
    });
    const refreshTokenData = await signRefreshToken({
      userDetails,
    });

    res.send({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        admin: user.admin,
      },

      accessTokenData,
      refreshTokenData,
    });
  } else {
    return res.status(400).json({ error: "Email and password do not match." });
  }
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const userByEmail = await User.findOne({ email });
  const userByUsername = await User.findOne({ username });
  if (userByEmail && userByUsername) {
    return res.status(400).json({
      error: "Both username and email are taken!",
    });
  }
  if (userByEmail) {
    return res.status(400).json({
      error: "Email is taken!",
    });
  }

  if (userByUsername) {
    return res.status(400).json({
      error: "Username is taken!",
    });
  }
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    let userDetails = {
      userId: user._id,
      userName: user.username,
      admin: user.admin,
    };

    const accessTokenData = await signAccessToken(userDetails);
    const refreshTokenData = await signRefreshToken(userDetails);
    res.status(200).send({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      accessTokenData,
      refreshTokenData,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ error: "Error with registration. Please try again." });
  }
};

//get the usernames of all users for project assignment
exports.getAllUsers = async (req, res) => {
  const users = await User.find({});
  if (users) {
    res.send(users);
  } else {
    res.status(404).json({ error: "Error fetching users." });
  }
};

//middleware
exports.handleProjectAssignments = async (req, res, next) => {
  console.log(req.payload);
  console.log(req.body);
  // let created_projects_new = [];

  try {
    const userTemp = await User.findOne({
      _id: req.payload.userObj.userDetails.userId,
    });

    userTemp.created_projects.push(req.body);
    await userTemp.save();
    next();
  } catch (err) {
    console.log(err);
  }
};
