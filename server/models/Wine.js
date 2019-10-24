const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/recipe', { useNewUrlParser: true });
mongoose.set('debug', true);
const wineSchema = new mongoose.Schema({
    url: String,
    name: String,
    wineCategory: String,
    image: String,
    description: String,
    origin: String,
    ingredients: Array,
    notes: String,
    additionalNotes: String,
    alcoholGrad: Number,
    foodAbbination: Array,
    production: String,
    rawIngredients: Array
});

var Wine = mongoose.model('Wine', wineSchema);

module.exports = Wine;