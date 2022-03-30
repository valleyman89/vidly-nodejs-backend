const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const { Rental, validate } = require("../models/rental");
const { valid } = require("joi");

const auth = require("../middleware/auth");
const express = require("express");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();

Fawn.init("mongodb://localhost:27017/vidly");

// ROUTES
// CREATE : POST
router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res
      .status(400)
      .send(`Customer ${req.body.customerId} does not exist.`);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res.status(400).send(`Movie ${req.body.movieId} does not exist.`);

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      name: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  new Fawn.Task()
    .save("rentals", rental)
    .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
    .run()
    .then(() => {
      res.send(rental);
    })
    .catch(function (err) {
      res.status(500).send(`FAILURE:  ${movie.id} / ${customer.id}`);
    });
});

// READ
// get: all
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

module.exports = router;
