const mongoose = require('../utils/db.js');
const recipeSchema = new mongoose.Schema({
    url: String,
    name: String,
    estimatedCost: String,
    recipeCategory: String,
    image: String,
    description: String,
    prepTime: Number,
    cookTime: Number,
    totalTime: Number,
    recipeYield: String,
    recipeIngredient: Array,
    recipeInstructions: Array,
    suitableForDiet: Array,
    nutrition: Object,
    aggregateRating: Object,
    ingredients: Array,
    mainIngredient: String
});

var Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;