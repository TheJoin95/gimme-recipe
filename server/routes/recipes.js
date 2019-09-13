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

const MENU_RECIPE_CATEGORY = {
    starter: 'antipasti',
    firstCourse: 'primi piatti',
    secondCourse: 'secondi piatti',
    sideDish: { $in: ['contorni', 'insalate'] },
    dessert: 'dolci',
    bonus: 'piatti unici'
};

/* Experimental */
const PERCENT_TOTAL_TIME_CATEGORY = {
    starter: 0.15,
    firstCourse: 0.25,
    secondCourse: 0.25,
    sideDish: 0.1,
    dessert: 0.25,
    bonus: 0.5
};

router.get('/gimme-menu', async function (req, res) {
    var menu = {
        starter: null,
        firstCourse: null,
        secondCourse: null,
        sideDish: null,
        dessert: null
    };

    
    if(req.query.uniqueDish !== undefined) {
        menu.bonus = null;
        delete menu.firstCourse;
        delete menu.secondCourse;
    }

    var menuKeys = Object.keys(menu);
    var criteria = buildAdvancedCriteria({}, req.query);
    if(req.query.customMenu !== undefined && typeof(req.query.customMenu) === 'object'){
        for(let index in menuKeys){
            if(req.query.customMenu.indexOf(menuKeys[index]) === -1)
            delete menu[menuKeys[index]];
        }
        menuKeys = Object.keys(menu);
    }

    let totalTime = criteria['totalTime']['$lte'];
    if(req.query.totalTime !== undefined && req.query.totalTime > 0) {
        criteria['totalTime']['$lte'] = parseInt(totalTime / menuKeys.length);
    }

    for(let index in menuKeys) {
        criteria['recipeCategory'] = MENU_RECIPE_CATEGORY[menuKeys[index]];

        if(criteria['recipeCategory'] == MENU_RECIPE_CATEGORY.secondCourse && menu.firstCourse !== undefined && menu.firstCourse !== null){
            criteria['mainIngredient'] = (menu.firstCourse.mainIngredient === 'pesce') ? 'pesce' : 'carne';
        }else if(criteria['recipeCategory'] == MENU_RECIPE_CATEGORY.firstCourse && menu.secondCourse !== undefined && menu.secondCourse !== null){
            criteria['mainIngredient'] = (menu.firstCourse.mainIngredient === 'pesce') ? 'pesce' : 'carne';
        }else if(criteria['mainIngredient'] !== undefined){
            delete criteria['mainIngredient'];
        }

        menu[menuKeys[index]] = await Recipe.aggregate()
            .match(criteria)
            .sample(1)
            .exec();

        menu[menuKeys[index]] = menu[menuKeys[index]][0];
    }

    res.json(menu);
});

router.get('/random', async function (req, res) {
    const criteria = buildAdvancedCriteria({}, req.query);

    const recipe = await Recipe.aggregate()
        .match(criteria)
        .sample(1)
        .exec();

    res.json(recipe);
});

router.get('/low-budget', async function (req, res) {
    const recipes = await Recipe.find(
        buildAdvancedCriteria({ estimatedCost: 'Basso' }, req.query),
        {},
        { limit: 20 }
    );

    res.json(recipes);
});

router.get('/by-calories/:calories', async function (req, res) {
    if(req.params.calories === undefined)
        res.status(400).send('No calories amount specified');
    
    let calories = parseInt(req.params.calories);
    if(calories <= 0)
        res.status(400).send("You need to specify a number greater than 0");
    
    const criteria = buildAdvancedCriteria({ 'nutrition.calories': {'$lte': calories} }, req.query);

    const recipes = await Recipe.find(
        criteria,
        {},
        { limit: 20 }
    );
    
    res.json(recipes);
});

router.get('/by-ingredients', async function (req, res) {
    if(req.query.ingredients === undefined)
        res.status(400).send('You need to specify at least one ingredient');

    const criteria = buildAdvancedCriteria({}, req.query);
    
    const recipes = await Recipe.find(
        criteria,
        {},
        { limit: 20, sort: { score: -1 } }
    );

    res.json(recipes);
});

router.get('/suitable-diet/:diet', async function (req, res) {
    if(DIETS[req.params.diet] === undefined)
        res.status(400).send('Bad request ' + req.params.diet + ' is not supported');

    const criteria = buildAdvancedCriteria({ suitableForDiet: DIETS[req.params.diet] }, req.query);
    const recipes = await Recipe.find(
        criteria,
        {},
        { limit: 20 }
    );

    res.json(recipes);
});

router.get('/time-saver', async function (req, res) {
    const criteria = { totalTime: { $lte: 20 } };

    const recipes = await Recipe.find(
        criteria,
        {},
        { limit: 20, sort: { totalTime: 1 } }
    );
    res.json(recipes);
});

router.get('/easy-todo', async function (req, res) {
    const criteria = buildAdvancedCriteria({ prepTime: {$lte: 10} }, req.query);

    const recipes = await Recipe.find(
        criteria,
        {},
        { limit: 20 }
    );

    res.json(recipes);
});

router.get('/most-rated', async function (req, res){
    var criteria = { 'aggregateRating.ratingCount': {'$gte': 100} };

    criteria = buildAdvancedCriteria(criteria, req.query);

    const recipes = await Recipe.aggregate()
        .match(criteria)
        .sort({ 'aggregateRating.ratingCount': -1, 'aggregateRating.ratingCount': -1 })
        .limit(20)
        .exec();

    res.json(recipes);
});

const buildAdvancedCriteria = function (criteria, queryParams) {
    const { recipeCategory, suitableForDiet, ingredients, totalTime } = getQueryParams(queryParams);

    if(ingredients !== undefined)
        criteria['$text'] = { $search: ingredients.map((ingr) => { return "\"" + ingr + "\""; }).join(" ") };

    if(recipeCategory !== undefined)
        criteria['recipeCategory'] = recipeCategory;

    if(suitableForDiet !== undefined)
        criteria['suitableForDiet'] = suitableForDiet;

    if(totalTime !== undefined)
        criteria['totalTime'] = totalTime;

    return criteria;
}

const getQueryParams = function (queryParams)  {
    const params = {};

    if(queryParams.ingredients !== undefined && typeof(queryParams.ingredients) === 'object'){
        params['ingredients'] = queryParams.ingredients;
        // params['ingredients'] = { $all: queryParams.ingredients.map((entry) => { return new RegExp(entry.trim().toLowerCase(), 'i'); }) };
    }

    if(queryParams.totalTime !== undefined && queryParams.totalTime > 0)
        params['totalTime'] = { $lte: parseInt(queryParams.totalTime) };

    if(queryParams.recipeCategory !== undefined && typeof(queryParams.ingredients) === 'object')
        params['recipeCategory'] = { $in: queryParams.recipeCategory.map((entry) => { return entry.trim(); }) };

    if(queryParams.diet !== undefined)
        params['suitableForDiet'] = { $in: queryParams.diet.split(',').map((entry) => { return DIETS[entry]; }) };

    return params;
};

module.exports = router;