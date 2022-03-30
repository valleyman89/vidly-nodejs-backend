const { Customer, validate } = require("../models/customer");

const auth = require("../middleware/auth");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// ROUTES
// CREATE
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    number: req.body.number,
  });

  customer = await customer.save();
  res.send(customer);
});

// READ
// GET: single
router.get("/:id", async (req, res) => {
  // Get
  const customer = await Customer.findById(req.params.id);
  // Exist?
  if (!customer)
    return res.status(404).send(`Customer ${req.params.id} does not exist.`);
  // Return
  res.send(customer);
});
// GET: all
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  // Update
  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    isGold: req.body.isGold,
    number: req.params.number,
    new: true,
  });
  // Exist?
  if (!customer)
    return res.status(404).send(`Customer ${req.params.id} does not exist`);
  // Valid?
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Return
  res.send(customer);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  // Delete
  const customer = await Customer.findByIdAndDelete(req.params.id);
  // Exist?
  if (!customer)
    return res.status(404).send(`Customer ${req.params.id} does not exist`);
  // Return
  res.send(customer);
});

// EXPORT
module.exports = router;
