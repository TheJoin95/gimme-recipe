const Recipe = require('./model/Recipe');
const https = require('https');

var args = process.argv.slice(2);
if(args.length == 0)
    return "Specifiy the \"action\" params";

var nextPageUrl = 'https://www.giallozafferano.it/ricette-cat/';
var urls = [];
var duplicated = 0;
var timeout = 2000;
var maxTimeout = 3000;
var minTimeout = 500;

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
        console.log(new Date().setMonth(new Date().getMonth() - 1));
        Recipe.find(
            { processDate: { $lte: new Date() } },
            { url: 1 },
            { limit: 20, sort: {processDate: 1} },
            function (err, recipes) {
                for(let key in recipes) {
                    setTimeout(function() {
                        getDetails(recipes[key].url);
                    }, 2000);
                }
            }
        );

        break;

    default:
        console.log("No action");
        break;
}


function getDetails (url) {
    console.log("Current page ", url);
    
    const req = https.get(url, (res) => {
        const { statusCode } = res;
        
        console.log("Response status code: ", statusCode);
        
        var data = "";
        res.on('data', (d) => {
            data += d;
        });

        res.on('end', () => {
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
            delete details.interactionStatistic;
            delete details.aggregateRating['@type'];

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
};
