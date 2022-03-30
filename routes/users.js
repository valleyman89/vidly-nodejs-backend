const { User, validate } = require("../models/user");

const _ = require("lodash");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const config = require("config");
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const router = express.Router();

// CREATE : POST
router.post("/", async (req, res) => {
  // Valid?
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Exist?
  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send(`User ${req.body.email} already exists`);

  // Post
  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // Token
  const token = user.generateAuthToken();
  // Return
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

// READ
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

module.exports = router;
