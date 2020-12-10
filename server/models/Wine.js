const mongoose = require('../utils/db.js');
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