const express = require('express');
const compression = require('compression');
const cors = require('cors');
const recipes = require('./routes/recipes');

const app = express();
app.use(compression());
app.use(cors());

app.use('/recipe', recipes);

app.listen(3000, function() {
    console.log("App listening on port 3000");
});
