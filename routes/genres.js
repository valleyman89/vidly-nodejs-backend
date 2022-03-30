const { Genre, validate } = require("../models/genre");

const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const express = require("express");
const mongoose = require("mongoose");
const { logger } = require("winston");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");

// ROUTES
// CREATE : POST
router.post("/", auth, async (req, res) => {
  // Valid?
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Post
  let genre = new Genre({
    name: req.body.name,
  });

  genre = await genre.save();
  // Return
  res.send(genre);
});

// READ : GET : all
router.get("/", async (req, res) => {
  // throw new Error("could not get the genres");
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

// READ :GET : single
router.get("/:id", validateObjectId, async (req, res) => {
  //Get
  const genre = await Genre.findById(req.params.id);
  //Exist?
  if (!genre)
    return res.status(404).send(`Genre ${req.params.id} does not exist.`);
  //Return
  res.send(genre);
});

// UPDATE : PUT
router.put("/:id", [auth, validateObjectId], async (req, res) => {
  // Update
  const genre = await Genre.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    new: true,
  });
  // Exist?
  if (!genre)
    return res.status(404).send(`Genre ${req.params.id} does not exist.`);
  // Valid?
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Return
  res.send(genre);
});

// DELETE : DELETE
router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  // Delete
  const genre = await Genre.findByIdAndDelete(req.params.id);
  // Exist?
  if (!genre)
    return res.status(404).send(`Genre ${req.params.id} does not exist.`);
  // Return
  res.send(genre);
});

module.exports = router;
