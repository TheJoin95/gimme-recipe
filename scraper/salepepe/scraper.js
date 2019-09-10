const Recipe = require('./model/Recipe');
const Wine = require('./model/Wine');
const https = require('https');

var args = process.argv.slice(2);
if(args.length == 0)
    return "Specifiy the \"action\" params";

var nextPageUrlRecipe = 'https://www.salepepe.it/masterchef_recipe-sitemap0.xml';
var PAGE_NUM = 1;
var maxPage = 7;
var urls = [];
var duplicated = 0;
var timeout = 500;
var maxTimeout = 2000;
var minTimeout = 300;

switch (args[0].split('=')[1]) {
    case 'getWineDetails':
        (async function() {
            const req = https.get('https://www.salepepe.it/salepepe_schedavino-sitemap.xml', async (res) => {
                const { statusCode } = res;
                console.log("Response status code: ", statusCode);
                var data = "";
                res.on('data', (d) => {
                    data += d;
                });
                res.on('end', async () => {
                    var urlRegex = /<loc>(.+)<\/loc>/gm;
                    timeout = (Math.random() * (maxTimeout - minTimeout) + minTimeout);
                    PAGE_NUM++;
                    var matches = [];
                    while (matches = urlRegex.exec(data)) {
                        urls.push(matches[1]);
                        var newWine = new Wine({ url: matches[1], author: 'salepepe' });
                        newWine.save(function (err, wine) {
                            if (err !== null) {
                                duplicated++;
                            }
                        });

                        await getWineDetails(matches[1]);
                    }
                });
            });

        })();

        break;

    case 'retrieveAll':
        (async function getUrls (nextPageUrlRecipe) {
            nextPageUrlRecipe = nextPageUrlRecipe.replace(/\d/, PAGE_NUM);
            console.log("Current page ", nextPageUrlRecipe);
            
            if(PAGE_NUM > maxPage) return false;
            
            const req = https.get(nextPageUrlRecipe, async (res) => {
                const { statusCode } = res;
                
                console.log("Response status code: ", statusCode);
                
                var data = "";
                res.on('data', (d) => {
                    data += d;
                });
        
                res.on('end', async () => {
                    var urlRegex = /<loc>(.+)<\/loc>/gm;
                    timeout = (Math.random() * (maxTimeout - minTimeout) + minTimeout);
                    PAGE_NUM++;

                    var matches = [];
                    while (matches = urlRegex.exec(data)) {
                        if(matches[1].match(/ricette/i) !== null) {
                            urls.push(matches[1]);
                            var newRecipe = new Recipe({ url: matches[1], author: 'salepepe' });
                            newRecipe.save(function (err, recipe) {
                                if (err !== null) {
                                    duplicated++;
                                }
                            });
                        }
                    }
        
                    await new Promise(resolve => setTimeout(resolve, timeout));
                    return getUrls(nextPageUrlRecipe);
                });
            });
        
            console.log("Total Found %d\nInfo: Found %d duplicates out of %d total\n", urls.length, duplicated, urls.length);
        })(nextPageUrlRecipe);
        break;

    case "getDetailOfAllRecipes":
        var now = new Date();
        var criteria = { author: 'salepepe', processDate: { $lte: new Date(now.getFullYear(), (now.getMonth() - 1), now.getDay()) } };
        criteria.processDate = {$exists: false};
        Recipe.find(
            criteria,
            { url: 1 },
            { sort: {processDate: 1} },
            async function (err, recipes) {
                for(let key in recipes) {
                    await getDetails(recipes[key].url);
                }
            }
        );

        break;

    default:
        console.log("No action");
        break;
}

const RECIPE_CATEGORY_MAP = {
	'dolci-dessert': 'dolci',
	secondi: 'secondi piatti',
	antipasti: 'antipasti',
	'piatto-unico': 'piatti unici',
	primi: 'primi piatti',
	lieviti: 'lievitati',
	bevande: 'bevande',
	contorni: 'contorni',
	'torte-salate-souffle': 'torte salate',
	'salse-sughi': 'salse e funghi',
	'conserve-confetture': 'marmellate e conserve',
	'prima-colazione': 'colazione'
};

const RECIPE_DIET_MAP = {
    bio: 'http://schema.org/BioDiet',
    integrale:'http://schema.org/Integral',
    light: 'http://schema.org/LowCalorieDiet',
    'senza glutine':'http://schema.org/GlutenFreeDiet',
    'senza lattosio':'http://schema.org/FreeMilkDiet',
    'senza uova':'http://schema.org/FreeEggsDiet',
    vegano: 'http://schema.org/VeganDiet',
    vegetariano: 'http://schema.org/VegetarianDiet',
};

const distinct = function(value, index, self) {
    return self.indexOf(value) === index;
}

var getWineDetails = async function (url) {
    console.log("Current page ", url);
    
    const req = https.get(url, async (res) => {
        const { statusCode } = res;
        
        console.log("Response status code: ", statusCode);
        
        var data = "";
        res.on('data', (d) => {
            data += d;
        });

        res.on('end', async () => {

            timeout = (Math.random() * (maxTimeout - minTimeout) + minTimeout);
            var dataRegex = {
                name: /<h1.+>(.+)<\/h1>$/m,
                origin: /Origine<\/h3>\s+<p class="lato">(.+)<\/p>$/mi,
                ingredients: /Uve<\/h3>\s+<p class="lato">(.+)<\/p>$/mi,
                notes: /Note tecniche<\/h3>\s+<p class="lato">(.+)<\/p>$/mi,
                alcoholGrad: /Gradazione alcolica<\/h3>\s+<p class="lato">(.+)<\/p>$/mi,
                additionalNotes: /Come servire<\/h3>\s+<p class="lato">(.+)<\/p>$/mi,
                foodAbbination: /Abbinamenti<\/h3>\s+<p class="lato">(.+)<\/p>$/mi,
                production: /Produttore<\/h3>\s+<p class="lato">(.+)<\/p>$/mi,
                image: /<img.+srcset=".+300w, (.+) 1024w"/mi,
                description: /<div class="tab-entry-summary lato">\s+(.+\s+.+|.+)<\/p>\s+<\/div><!-- \.entry-summary/m,
            };

            var details = {};
            details.author = 'salepepe';

            for (let field in dataRegex) {
                var matchRegex = data.match(dataRegex[field]);
                if(matchRegex !== null)
                    details[field] = matchRegex[1];
            }

            details.wineCategory = url.match(/(bianchi|rossi|bollicine|dolci)\//)[1];

            if(details.description !== undefined)
                details.description = details.description.replace(/(<([^>]+)>)/gm, '');

            details.ingredients = details.ingredients.split(',');
            details.rawIngredients = details.ingredients.map(function(entry) {
                return entry.replace(/\d+%/, '').trim();
            }).filter(distinct);

            details.alcoholGrad = parseFloat(details.alcoholGrad.replace(',','.').match(/[\d.]+/)[0]);

            details.processDate = new Date();
            Wine.updateOne(
                { url: url },
                details,
                function(err, raw) {
                    if(err !== null) console.log(err);
                }
            );
        });
    });

    return await new Promise(resolve => setTimeout(resolve, timeout));
};

var getDetails = async function (url) {
    console.log("Current page ", url);
    
    const req = https.get(url, async (res) => {
        const { statusCode } = res;
        
        console.log("Response status code: ", statusCode);
        
        var data = "";
        res.on('data', (d) => {
            data += d;
        });

        res.on('end', async () => {
            timeout = (Math.random() * (maxTimeout - minTimeout) + minTimeout);
            var urlRegex = /application\/ld\+json">\s+(.+)\s+/gm;
            var dietRegex = /<a href=".+<span class="path\d+"><\/span><\/span><span class="classificazione-txt hidden-xs">([a-zA-Z ]+)<\/span><\/a>/;
            var matches = [];
            var details = {};

            while (matches = urlRegex.exec(data)) {
                details = JSON.parse(matches[1]);
            }

            delete details['@context'];
            delete details['@type'];
            details.author = 'salepepe';

            if(details.interactionStatistic !== undefined)
                delete details.interactionStatistic;

            if(details.aggregateRating !== undefined)
                delete details.aggregateRating['@type'];

            details.cookTime = details.prepTime = details.totalTime = '0';

            details.prepTime = (details.prepTime == 'PTM') ? 0: parseInt(details.prepTime.match(/[\d.]+/)[0]);
            details.totalTime = (details.totalTime == 'PTM') ? 0: parseInt(details.totalTime.match(/[\d.]+/)[0]);
            details.cookTime = (details.cookTime == 'PTM') ? 0: parseInt(details.cookTime.match(/[\d.]+/)[0]);

            if(details.image !== undefined)
                details.image = details.image.url;

            if(details.recipeIngredient !== undefined)
                details.recipeIngredient = details.recipeIngredient.filter(distinct);

            var recipeCategory = url.replace('https://www.salepepe.it/ricette/', '').split('/')[0];

            if(details.recipeInstructions === undefined)
                details.recipeInstructions = '';

            details.recipeInstructions = details.recipeInstructions.split(/\d+\) /gm);
            details.suitableForDiet = [];

            details.recipeCategory = RECIPE_CATEGORY_MAP[recipeCategory];
            details.numStep = details.recipeInstructions.length;
            
            if(url.match(/pesce/)){
                details.mainIngredient = 'pesce';
            }else if((url.match(/carn/))){
                details.mainIngredient = 'carne';
            }

            let match = [];
            while(match = dietRegex.exec(data)) {
                data = data.replace(match[0], '');
                details.suitableForDiet.push(RECIPE_DIET_MAP[match[1].toLowerCase()]);
            }
            
            details.ingredients = [];
            if(details.recipeIngredient !== undefined) {
                details.ingredients = details.recipeIngredient.map(function(ingredient) {
                    return ingredient.replace(/(q\.b\.|\d+\s+g|[\d.]+|[\d.]+\s\w+$|\d+$|kg|rametti|spicchi|l$|\&\w+;$)/g, '').trim().toLowerCase();
                }).filter(distinct);
            }

            details.numIngredients = details.ingredients.length;

            if(details.nutrition !== undefined) {
                delete details.nutrition['@type'];
                for(let key in details.nutrition) {
                    let matchedNum = details.nutrition[key].match(/^[\d.]+/);
                    details.nutrition[key] = (matchedNum === null) ? 0 : parseInt(matchedNum[0]);
                }
            }

            details.processDate = new Date();
            Recipe.updateOne(
                { url: url },
                details,
                function(err, raw) {
                    if(err !== null) console.log(err);
                }
            );
        });
    });

    return await new Promise(resolve => setTimeout(resolve, timeout));
};
