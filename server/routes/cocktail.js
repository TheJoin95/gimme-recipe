const express = require('express');
const Cocktail = require('../models/Cocktail');
const router = express.Router();

router.get('/random', async function(req, res) {
    const criteria = buildAdvancedCriteria({}, req.query);

    const cocktail = await Cocktail.aggregate()
        .match(criteria)
        .sample(1)
        .exec();

    res.json(cocktail);
});

router.get('/by-base-spirit', async function(req, res) {
    if(req.params.baseSpirit === undefined && req.params.baseSpirit === null)
        res.status(400).send('No spirit (of humor) specified');
    
    const criteria = buildAdvancedCriteria({ 'baseSpirit': req.params.baseSpirit }, req.query);

    const cocktails = await Cocktail.find(
        criteria,
        {},
        { limit: 20 }
    );
    
    res.json(cocktails);
});

router.get('/by-ingredients', async function(req, res) {
    if(req.query.ingredients === undefined)
        res.status(400).send('You need to specify at least one ingredient');

    const criteria = buildAdvancedCriteria({}, req.query);
    
    const cocktails = await Cocktail.find(
        criteria,
        {},
        { limit: 20 }
    );

    res.json(cocktails);
});

router.get('/easy-todo', async function(req, res) {
    const criteria = buildAdvancedCriteria({ difficulty: 'Simple' }, req.query);

    const cocktails = await Cocktail.find(
        criteria,
        {},
        { limit: 20 }
    );

    res.json(cocktails);
});

const buildAdvancedCriteria = function(criteria, queryParams) {
    const { ingredients } = getQueryParams(queryParams);

    if(ingredients !== undefined)
        criteria['ingredients'] = ingredients;
    
    if(queryParams.hours !== undefined && typeof(queryParams.hours) === 'object')
        params['hours'] = { $in: queryParams.hours.map((entry) => { return entry.trim(); }) };
    
    if(queryParams.themes !== undefined && typeof(queryParams.themes) === 'object')
        params['themes'] = { $in: queryParams.themes.map((entry) => { return entry.trim(); }) };
    
    if(queryParams.cocktailType !== undefined && typeof(queryParams.cocktailType) === 'object')
        params['cocktailType'] = { $in: queryParams.cocktailType.map((entry) => { return entry.trim(); }) };
        
    if(queryParams.garnish !== undefined && typeof(queryParams.garnish) === 'object')
        params['garnish'] = { $in: queryParams.garnish.map((entry) => { return entry.trim(); }) };

    return criteria;
}

const getQueryParams = function(queryParams)  {
    const params = {};

    if(queryParams.ingredients !== undefined && typeof(queryParams.ingredients) === 'object'){
        params['ingredients'] = { $all: queryParams.ingredients.map((entry) => { return new RegExp(entry.trim().toLowerCase(), 'i'); }) };
    }

    return params;
};

module.exports = router;