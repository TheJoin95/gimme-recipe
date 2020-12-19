const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.RECIPE_MONGO_USER}:${process.env.RECIPE_MONGO_PWD}@cluster0.luqb9.mongodb.net/recipes?retryWrites=true&w=majority`, { useNewUrlParser: true });
mongoose.set('debug', true);

module.exports = mongoose