const express = require('express');
const Recipe = require('../models/Recipe');
const router = express.Router();

const DIETS = {
    diabetic: 'http://schema.org/DiabeticDiet',
    glutenFree: 'http://schema.org/GlutenFreeDiet',
    halal: 'http://schema.org/HalalDiet',
    hindu: 'http://schema.org/HinduDiet',
    kosher: 'http://schema.org/KosherDiet',
    lowCalorie: 'http://schema.org/LowCalorieDiet',
    lowFat: 'http://schema.org/LowFatDiet',
    lowLactose: 'http://schema.org/LowLactoseDiet',
    lowSalt: 'http://schema.org/LowSaltDiet',
    vegan: 'http://schema.org/VeganDiet',
    vegetarian: 'http://schema.org/VegetarianDiet',
};

router.get('/gimme-menu', function(req, res) {
    // req.cookies
    // req.query
    res.send("Oke");
});

router.get('/random', function(req, res) {
    // req.cookies
    // req.query
    res.send("Oke");
});

router.get('/low-budget', async function(req, res) {
    const recipes = await Recipe.find(
        buildAdvancedCriteria({ estimatedCost: 'Basso' }, req.query),
        {},
        { limit: 20 }
    );

    res.json(recipes);
});

router.get('/by-calories', function(req, res) {
    // req.cookies
    // req.query
    res.send("Oke");
});

router.get('/by-ingredients', function(req, res) {
    // req.cookies
    // req.query
    res.send("Oke");
});

router.get('/suitable-diet/:diet', function(req, res) {
    if(DIETS[diet] === undefined)
        res.status(400).send('Bad request ' + diet + ' is not supported');

    const criteria = { suitableForDiet: DIETS[diet] };
    criteria = buildAdvancedCriteria(criteria, req.query);

    const recipes = Recipe.find(
        criteria,
        {},
        { limit: 20 }
    );

    res.json(recipes);
});

router.get('/time-saver', async function(req, res) {
    const criteria = { totalTime: { $lte: 20 } };

    const recipes = await Recipe.find(
        criteria,
        {},
        { limit: 20, sort: { totalTime: 1 } }
    );
    res.json(recipes);
});

router.get('/easy-todo', async function(req, res) {
    const criteria = buildAdvancedCriteria({ prepTime: {$lte: 10} }, req.query);

    const recipes = await Recipe.find(
        criteria,
        {},
        { limit: 20 }
    );

    res.json(recipes);
});

router.get('/most-rated', async function(req, res){
    const criteria = { 'aggregateRating.ratingCount': {'$gte': 100} };

    criteria = buildAdvancedCriteria(criteria, req.query);

    const recipes = await Recipe.aggregate()
        .match(criteria)
        .sort({ 'aggregateRating.ratingCount': -1, 'aggregateRating.ratingCount': -1 })
        .limit(200)
        .exec();

    res.json(recipes);
});

const buildAdvancedCriteria = function(criteria, queryParams) {
    const { recipeCategory, suitableForDiet } = getQueryParams(queryParams);

    if(recipeCategory !== undefined)
        criteria['recipeCategory'] = recipeCategory;

    if(suitableForDiet !== undefined)
        criteria['suitableForDiet'] = suitableForDiet;

    return criteria;
}

const getQueryParams = function(queryParams)  {
    const params = {};

    if(queryParams.recipeCategory !== undefined)
        params['recipeCategory'] = { $in: queryParams.recipeCategory.split(',') };

    if(queryParams.diet !== undefined)
        params['suitableForDiet'] = { $in: queryParams.diet.split(',') };

    return params;
};

module.exports = router;