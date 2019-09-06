const Recipe = require('./model/Recipe');
const https = require('https');

var args = process.argv.slice(2);
if(args.length == 0)
    return "Specifiy the \"action\" params";

var nextPageUrl = 'https://www.giallozafferano.it/ricette-cat/';
var urls = [];
var duplicated = 0;
var timeout = 500;
var maxTimeout = 2000;
var minTimeout = 300;

switch (args[0].split('=')[1]) {
    case 'retrieveAll':
        (async function getUrls (nextPageUrl) {
            console.log("Current page ", nextPageUrl);
            
            if(nextPageUrl === null) return false;
            
            const req = https.get(nextPageUrl, async (res) => {
                const { statusCode } = res;
                
                console.log("Response status code: ", statusCode);
                
                var data = "";
                res.on('data', (d) => {
                    data += d;
                });
        
                res.on('end', async () => {
                    timeout = (Math.random() * (maxTimeout - minTimeout) + minTimeout);
                    nextPageUrl = null;
                    var urlRegex = /gz-title.+href="(?<url>.+)" /gm;
                    var nextPageRegex = /gz-arrow next.+href="(.+)" /gm;
                    var matches = [];
                    while (matches = urlRegex.exec(data)) {
                        urls.push(matches[1]);
                        var newRecipe = new Recipe({ url: matches[1] });
                        newRecipe.save(function (err, recipe) {
                            if (err !== null) {
                                duplicated++;
                                //console.log(err);
                            }
                        });
                    }
        
                    while (matches = nextPageRegex.exec(data))
                        nextPageUrl = matches[1];
        
                    await new Promise(resolve => setTimeout(resolve, timeout));
                    
                    return getUrls(nextPageUrl);
                });
            });
        
            console.log("Total Found %d\nInfo: Found %d duplicates out of %d total\n", urls.length, duplicated, urls.length);
        })(nextPageUrl);
        break;

    case "getDetailOfAllRecipes":
        var now = new Date();
        var criteria = { processDate: { $lte: new Date(now.getFullYear(), (now.getMonth() - 1), now.getDay()) } };

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

const distinct = function(value, index, self) {
    return self.indexOf(value) === index;
}

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
            var matches = [];
            var details = {};

            while (matches = urlRegex.exec(data)) {
                details = JSON.parse(matches[1]);
            }

            delete details['@context'];
            delete details['@type'];
            delete details.author;

            if(details.interactionStatistic !== undefined)
                delete details.interactionStatistic;

            if(details.aggregateRating !== undefined)
                delete details.aggregateRating['@type'];

            details.prepTime = (details.prepTime == 'PTM') ? 0: parseInt(details.prepTime.match(/[\d.]+/)[0]);
            details.totalTime = (details.totalTime == 'PTM') ? 0: parseInt(details.totalTime.match(/[\d.]+/)[0]);
            details.cookTime = (details.cookTime == 'PTM') ? 0: parseInt(details.cookTime.match(/[\d.]+/)[0]);

            details.ingredients = details.recipeIngredient.map(function(ingredient) {
                return ingredient.replace(/(q\.b\.|\d+\s+g|\d+$|kg|rametti|spicchi|\&\w+;$)/g, '').trim().toLowerCase();
            }).filter(distinct);

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
