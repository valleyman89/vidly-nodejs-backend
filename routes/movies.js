const { Genre } = require("../models/genre");
const { Movie, validate } = require("../models/movie");

const auth = require("../middleware/auth");
const express = require("express");
const mongoose = require("mongoose");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();

// ROUTES
// CREATE
router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre)
    return res.status(400).send(`${req.body.genreId} is an invalid Genre.`);

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await movie.save();
  res.send(movie);
});

// READ
// GET : ALL
router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

// GET: single
router.get("/:id", validateObjectId, async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send(`Movie ${req.params.id} does not exist`);

  res.send(movie);
});
// UPDATE
router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre)
    return res.status(400).send(`${req.body.genreId} is an invalid Genre.`);

  const movie = await Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  if (!movie)
    return res.send(404).send(`Movie ${req.params.id} does not exist`);

  res.send(movie);
});

// DELETE
router.delete("/:id", [auth, validateObjectId], async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie)
    return res.status(404).send(`Movie ${req.params.id} does not exist.`);

  res.send(movie);
});

module.exports = router;
