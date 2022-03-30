const mongoose = require("mongoose");
const Joi = require("joi");

// DB SCHEMA
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
});
const Genre = mongoose.model("Genre", genreSchema);

// FUNCTIONS (using new Joi method)
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;
