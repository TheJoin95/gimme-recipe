const express = require('express');
const Wine = require('../models/Wine');
const router = express.Router();

router.get('/random', async function(req, res) {
    const criteria = buildAdvancedCriteria({}, req.query);

    const wine = await Wine.aggregate()
        .match(criteria)
        .sample(1)
        .exec();

    res.json(wine);
});

// Da definire meglio; probabilmente cambierà il criterio di ricerca. Troppo generico e poco elaborato.
router.get('/food-abbination', async function(req, res) {
    if(req.query.ingredients === undefined)
        res.status(400).send('You need to specify at least one ingredient');

    const criteria = buildAdvancedCriteria({}, req.query);
    
    const wines = await Wine.find(
        criteria,
        {},
        { limit: 20, sort: { score: -1 } }
    );

    res.json(wines);
});

router.get('/by-grapevine', async function(req, res) {
    if(req.query.grapevine === undefined)
        res.status(400).send('You need to specify at least one grapevine');

    const criteria = buildAdvancedCriteria({}, req.query);
    
    const wines = await Wine.find(
        criteria,
        {},
        { limit: 20 }
    );

    res.json(wines);
});

const buildAdvancedCriteria = function(criteria, queryParams) {
    const { foodAbbination, rawIngredients, alcoholGrad, origin, category } = getQueryParams(queryParams);

    if(rawIngredients !== undefined)
        criteria['rawIngredients'] = rawIngredients;

    if(foodAbbination !== undefined)
        criteria['$text'] = { $search: foodAbbination.map((fa) => { return "\"" + fa + "\""; }).join(" ") };

    if(alcoholGrad !== undefined)
        criteria['alcoholGrad'] = alcoholGrad;
    
    if(origin !== undefined)
        criteria['origin'] = origin;
    
    if(category !== undefined)
        criteria['wineCategory'] = category;

    return criteria;
}

const getQueryParams = function(queryParams)  {
    const params = {};

    if(queryParams.grapevine !== undefined && typeof(queryParams.grapevine) === 'object')
        params['rawIngredients'] = { $all: queryParams.grapevine.map((entry) => { return new RegExp(entry.trim().toLowerCase(), 'i'); }) };

    if(queryParams.alcoholGrad !== undefined && !isNaN(parseInt(queryParams.alcoholGrad)))
        params['alcoholGrad'] = parseInt(queryParams.alcoholGrad);

    if(queryParams.category !== undefined && !isNaN(parseInt(queryParams.category)))
        params['wineCategory'] = queryParams.category;

    if(queryParams.origin !== undefined && typeof(queryParams.origin) === 'object')
        params['origin'] = { $in: queryParams.origin.map((entry) => { return entry.trim(); }) };
    
    if(queryParams.ingredients !== undefined && typeof(queryParams.ingredients) !== 'null')
        params['foodAbbination'] = queryParams.ingredients;


    return params;
};

module.exports = router;
