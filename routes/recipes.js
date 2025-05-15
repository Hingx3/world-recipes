const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const Favorite = require("../models/Favorite");


router.post("/", async (req, res) => {
  const country = req.body.country;
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`);
  const data = await response.json();
  res.render("results", { meals: data.meals, country });
});


router.post("/add", async (req, res) => {
    const { mealId, name, image } = req.body;

    const existing = await Favorite.findOne({ mealId });
    if (!existing) {
      await Favorite.create({ mealId, name, image });
    }
  
    res.redirect("/favorites");
});

router.post("/remove", async (req, res) => {
    const { mealId } = req.body;
    await Favorite.deleteOne({ mealId });
    res.redirect("/favorites");
});

router.post("/remove-all", async (req, res) => {
    await Favorite.deleteMany({});
    res.redirect("/favorites");
});

router.post("/details", async (req, res) => {
    const idMeal = req.body.idMeal;
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
    const data = await response.json();
    const meal = data.meals[0];

    const formattedInstructions = splitInstructions(meal.strInstructions);

    res.render("details", { meal, formattedInstructions });
});

function splitInstructions(instructions) {
    if (!instructions) return [];
  
    const rawSteps = instructions
      .split(/(?:\bSTEP\s*\d+[:.\s]*)|(?=\b\d+\s+[A-Z][a-z])/g)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  
    const uniqueSteps = [];
    for (let step of rawSteps) {
      step = step.replace(/^(\d+)\s+(?=[A-Z][a-z])/, '$1. ');
  
      if (!uniqueSteps.includes(step)) {
        uniqueSteps.push(step);
      }
    }
  
    return uniqueSteps;
  }


router.get("/favorites", async (req, res) => {
  const favorites = await Favorite.find();
  res.render("favorites", { favorites });
});

module.exports = router;

