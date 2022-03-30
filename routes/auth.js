const { User } = require("../models/user");

const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const router = express.Router();
const validate = require("../middleware/validate");

// CREATE : POST
router.post("/", validate(validateAuth), async (req, res) => {
  // Valid?
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Exist?
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid credentials");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid credentials");

  const token = user.generateAuthToken();
  res.send(token);
});

function validateAuth(req) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;
