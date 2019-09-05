const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/recipe', { useNewUrlParser: true });

const recipeSchema = new mongoose.Schema({
    url: String,
    name: String,
    author: String,
    datePublished: Date,
    dateModified: Date,
    estimatedCost: String,
    recipeCategory: String,
    image: String,
    description: String,
    prepTime: String,
    cookTime: String,
    totalTime: String,
    recipeYield: String,
    recipeIngredient: Array,
    recipeInstructions: Array,
    suitableForDiet: Array,
    nutrition: Object,
    aggregateRating: Object
});

var Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;