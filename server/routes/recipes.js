const express = require('express');
const Recipe = require('../models/Recipe');
const router = express.Router();

router.get('/gimme-menu', function(req, res) {
    // req.cookies
    // req.query
    res.send("Oke");
});

router.get('/low-budget', function(req, res) {
    // req.cookies
    // req.query
    res.send("Oke");
});

router.get('/by-calories', function(req, res) {
    // req.cookies
    // req.query
    res.send("Oke");
});

router.get('/by-category', function(req, res) {
    // req.cookies
    // req.query
    res.send("Oke");
});

router.get('/by-ingredients', function(req, res) {
    // req.cookies
    // req.query
    res.send("Oke");
});

router.get('/suitable-diet', function(req, res) {
    // req.cookies
    // req.query
    res.send("Oke");
});

router.get('/few-ingredients', function(req, res) {
    // req.cookies
    // req.query
    res.send("Oke");
});

router.get('/time-saver', function(req, res) {
    // req.cookies
    // req.query
    res.send("Oke");
});

router.get('/easy-todo', function(req, res) {
    // req.cookies
    // req.query
    res.send("Oke");
});

router.get('/most-rated', async function(req, res){
    const criteria = { 'aggregateRating.ratingCount': {'$gte': 100} };

    if(req.query.recipeCategory !== undefined)
        criteria['recipeCategory'] = { $in: req.query.recipeCategory.split(',') };

    if(req.query.diet !== undefined)
        criteria['suitableForDiet'] = { $in: req.query.diet.split(',') };

    const recipes = await Recipe.aggregate()
        .match(criteria)
        .sort({ sort: { 'aggregateRating.ratingCount': -1, 'aggregateRating.ratingCount': -1 } })
        .limit(200)
        .exec();

    res.json(recipes);
});

module.exports = router;