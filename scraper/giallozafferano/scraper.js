const Recipe = require('./model/Recipe');
const https = require('https');

var nextPageUrl = 'https://www.giallozafferano.it/ricette-cat/';
var urls = [];
var duplicated = 0;
var timeout = 2000;
var maxTimeout = 3000;
var minTimeout = 500;

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
