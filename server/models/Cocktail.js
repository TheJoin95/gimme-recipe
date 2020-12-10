const mongoose = require('../utils/db.js');
const cockTailSchema = new mongoose.Schema({
    url: String,
    name: String,
    cocktailCategory: String,
    image: String,
    description: String,
    processDate: Date,
    ingredients: Array,
    notes: String,
    foodAbbination: Array,
    baseSpirit: Array,
    cocktailType: Array,
    served: Array,
    preparation: Array,
    strength: Array,
    difficulty: Array,
    hours: Array,
    themes: Array,
    brands: Array,
    garnish: Array,
    flavor: Array,
    glass: Array,
    ingredientsValue: Array,
    numIngredients: Number,
    recipeInstructions: String
});

var Cocktail = mongoose.model('Cocktail', cockTailSchema);

module.exports = Cocktail;
