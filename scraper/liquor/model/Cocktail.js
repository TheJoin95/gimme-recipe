const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/recipe', { useNewUrlParser: true });
mongoose.set('debug', true);
const cockTailSchema = new mongoose.Schema({
    url: String,
    name: String,
    author: String,
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
    strength: String,
    difficulty: String,
    hours: Array,
    themes: Array,
    brands: Array,
    garnish: Array,
    flavor: Array,
    glass: String,
    ingredientsValue: Array,
    numIngredients: Number
});

var Cocktail = mongoose.model('Wine', cockTailSchema);

module.exports = Cocktail;