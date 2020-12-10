const mongoose = require('mongoose');
mongoose.connect(`mongodb://${process.env.RECIPE_MONGO_USER}:${process.env.RECIPE_MONGO_PWD}@ds113923.mlab.com:13923/recipes`, { useNewUrlParser: true });
mongoose.set('debug', true);

module.exports = mongoose