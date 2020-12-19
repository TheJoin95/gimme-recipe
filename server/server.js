const express = require('express');
const compression = require('compression');
const cors = require('cors');
const recipes = require('./routes/recipes');
const wines = require('./routes/wine');
const cocktails = require('./routes/cocktail');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(compression());
app.use(cors());

app.use('/recipe', recipes);
app.use('/wine', wines);
app.use('/cocktail', cocktails);

app.listen(PORT, function() {
    console.log("App listening on port 3000");
});
