const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  mealId: String,
  name: String,
  image: String
});

module.exports = mongoose.model("Favorite", favoriteSchema);