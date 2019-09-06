const express = require('express');
const recipes = require('./routes/recipes');

const app = express();
app.use(compression());

app.use('/recipe', recipes);

app.listen(3000, function() {
    console.log("App listening on port 3000");
});
