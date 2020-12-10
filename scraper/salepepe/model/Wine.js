const mongoose = require('../../utils/db.js');
const wineSchema = new mongoose.Schema({
    url: String,
    name: String,
    author: String,
    wineCategory: String,
    image: String,
    description: String,
    processDate: Date,
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