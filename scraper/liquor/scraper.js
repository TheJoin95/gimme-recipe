const Cocktail = require('./model/Cocktail');
const https = require('https');

var args = process.argv.slice(2);
if(args.length == 0)
    return "Specifiy the \"action\" params";

var sitemapUrl = 'https://www.liquor.com/post_recipe.xml';
var urls = [];
var duplicated = 0;
var timeout = 500;
var maxTimeout = 2000;
var minTimeout = 300;

switch (args[0].split('=')[1]) {
    case 'retrieveAll':
        (async function() {
            const req = https.get(sitemapUrl, async (res) => {
                const { statusCode } = res;
                console.log("Response status code: ", statusCode);
                var data = "";
                res.on('data', (d) => {
                    data += d;
                });
                res.on('end', async () => {
                    var urlRegex = /<loc>(.+)<\/loc>/gm;
                    timeout = (Math.random() * (maxTimeout - minTimeout) + minTimeout);
                    var matches = [];
                    while (matches = urlRegex.exec(data)) {
                        urls.push(matches[1]);
                        var newCocktail = new Cocktail({ url: matches[1], author: 'liquor' });
                        newCocktail.save(function (err, wine) {
                            if (err !== null) {
                                duplicated++;
                            }
                        });

                        await getCocktailDetails(matches[1]);
                    }
                });
            });

        })();
        break;
    default:
        console.log("No action");
        break;
}

const decodeEntities = function (encodedString) {
    var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    var translate = {
        "nbsp":" ",
        "amp" : "&",
        "quot": "\"",
        "lt"  : "<",
        "gt"  : ">"
    };
    return encodedString.replace(translate_re, function(match, entity) {
        return translate[entity];
    }).replace(/&#(\d+);/gi, function(match, numStr) {
        var num = parseInt(numStr, 10);
        return String.fromCharCode(num);
    });
};

const distinct = function(value, index, self) {
    return self.indexOf(value) === index;
}

var getCocktailDetails = async function (url) {
    console.log("Current page ", url);
    
    const req = https.get(url, async (res) => {
        const { statusCode } = res;
        
        console.log("Response status code: ", statusCode);
        
        var data = "";
        res.on('data', (d) => {
            data += d;
        });

        res.on('end', async () => {
            const htmlRegex = /(<([^>]+)>)/gm;
            timeout = (Math.random() * (maxTimeout - minTimeout) + minTimeout);
            var dataRegex = {
                name: /<h1 itemprop="name">(.+)<\/h1>/gm,
                image: /<meta name=\"sailthru\.image\.full" content="(.+)"/gm,
                description: /<span itemprop="description">(<p>.+<\/p>\s)+<\/span>/mg,
                ingredients: /<div class="col-xs-9 x-recipe-ingredient">\s+(.+)<\/div>/gm, // in ordine incrementale da matchare con ingredientsValue
                ingredientsValue: /<div class="measure" itemprop="recipeIngredient"([\s\w-=;/"&]+)>/gm,  // .trim .split sul \n, .split sul data-, decodeEntities, 
                baseSpirit: /x-recipe-spirit" itemprop="keywords">(.+\s+)<\/div>/gm,
                cocktailType: /x-recipe-type" itemprop="keywords">(.+\s+)<\/div>/gm,
                served: /x-recipe-served" itemprop="keywords">(.+\s+)<\/div>/gm,
                preparation: /x-recipe-preparation" itemprop="keywords">(.+\s+)<\/div>/gm,
                strength: /x-recipe-strength" itemprop="keywords">(.+\s+)<\/div>/gm,
                difficulty: /x-recipe-difficulty" itemprop="keywords">(.+\s+)<\/div>/gm,
                hours: /x-recipe-hours" itemprop="keywords">(.+\s+)<\/div>/gm,
                themes: /x-recipe-themes" itemprop="keywords">(.+\s+)<\/div>/gm,
                brands: /x-recipe-brands" itemprop="keywords">(.+\s+)<\/div>/gm,
                garnish: /itemprop="recipeIngredient"><a href='\/\?post_type=recipe&s=(.+)'/gm,
                glass: /<div class="col-xs-9 recipe-link x-recipe-glasstype no-padding">(.+)<\/div>/gm,
                flavor: /<a href="\/flavor[\s\w-?_=/]+">([\w\s/-]+)<\/a>/gm
            };

            var details = {};
            details.author = 'liquor';

            for (let field in dataRegex) {
                let matchRegex = [];
                var i = 0;
                while((matchRegex = dataRegex[field].exec(data)) !== null) {
                    if(i === 0){
                        details[field] = matchRegex[1];
                    }else{
                        details[field] = (typeof(details[field]) === 'object') ? details[field] : [details[field]];
                        details[field].push(matchRegex[1]);
                    }
                        
                    i++;
                }
            }

            if(details.description !== undefined)
                details.description = details.description.replace(htmlRegex, '').trim();
            
            if(details.ingredients !== undefined){
                details.ingredients = details.rawIngredients = details.ingredients.map((entry) => { return entry.replace(htmlRegex, '').trim(); });
                details.numIngredients = details.ingredients.length;
            }

            if(details.garnish !== undefined && typeof(details.garnish) === 'object')
                details.garnish = details.garnish.map((entry) => { return entry.replace(htmlRegex, '').trim(); });
            
            if(details.ingredientsValue !== undefined) {
                let ingredientsValues = [];
                for(let i in details.ingredientsValue) {
                    let decodedString = decodeEntities(details.ingredientsValue[i]);
                    let ingredientsMeasure = decodedString
                        .replace('"','')
                        .split(/data-\w+=/)
                        .filter((entry) => { return entry.trim().length > 0; })
                        .map((entry) => { 
                            return entry
                                .trim()
                                .replace(htmlRegex, '')
                                .replace(/[">]/gm, '')
                                .split('&nbsp;');
                        });
                    
                    let objTmp = {};
                    for(let index in ingredientsMeasure) {
                        if(isNaN(parseFloat(ingredientsMeasure[index][0]))) continue;
                        let tmpKey = (ingredientsMeasure[index][1] === '') ? 'integer' : ingredientsMeasure[index][1];
                        objTmp[tmpKey] = parseFloat(ingredientsMeasure[index][0]);
                    }

                    ingredientsValues.push(objTmp);
                }

                details.ingredientsValue = ingredientsValues.filter((entry) => { return Object.keys(entry).length > 0; });
            }
            
            let keysToFormat = [
                'baseSpirit',
                'cocktailType',
                'served',
                'preparation',
                'strength',
                'difficulty',
                'hours',
                'themes',
                'brands',
                'glass'
            ];

            for(let i in keysToFormat) {
                if(details[keysToFormat[i]] !== undefined){
                    details[keysToFormat[i]] = details[keysToFormat[i]]
                        .split('</a> ')
                        .map((entry) => { return entry.replace(htmlRegex, '').trim(); });
                }
            }

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
