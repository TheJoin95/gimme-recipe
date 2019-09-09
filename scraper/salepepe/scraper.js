const Recipe = require('./model/Recipe');
const https = require('https');

var args = process.argv.slice(2);
if(args.length == 0)
    return "Specifiy the \"action\" params";

var nextPageUrl = 'https://www.salepepe.it/masterchef_recipe-sitemap0.xml';
var PAGE_NUM = 1;
var maxPage = 7;
var urls = [];
var duplicated = 0;
var timeout = 500;
var maxTimeout = 2000;
var minTimeout = 300;

switch (args[0].split('=')[1]) {
    case 'retrieveAll':
        (async function getUrls (nextPageUrl) {
            nextPageUrl = nextPageUrl.replace(/\d/, PAGE_NUM);
            console.log("Current page ", nextPageUrl);
            
            if(PAGE_NUM > maxPage) return false;
            
            const req = https.get(nextPageUrl, async (res) => {
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
                    return getUrls(nextPageUrl);
                });
            });
        
            console.log("Total Found %d\nInfo: Found %d duplicates out of %d total\n", urls.length, duplicated, urls.length);
        })(nextPageUrl);
        break;

    case "getDetailOfAllRecipes":
        var now = new Date();
        var criteria = { author: 'salepepe', processDate: { $lte: new Date(now.getFullYear(), (now.getMonth() - 1), now.getDay()) } };
        // var criteria = { processDate: {$exists: false} };
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
            details.author = 'salepepe';

            if(details.interactionStatistic !== undefined)
                delete details.interactionStatistic;

            if(details.aggregateRating !== undefined)
                delete details.aggregateRating['@type'];

            details.prepTime = (details.prepTime == 'PTM') ? 0: parseInt(details.prepTime.match(/[\d.]+/)[0]);
            details.totalTime = (details.totalTime == 'PTM') ? 0: parseInt(details.totalTime.match(/[\d.]+/)[0]);
            details.cookTime = (details.cookTime == 'PTM') ? 0: parseInt(details.cookTime.match(/[\d.]+/)[0]);

            details.recipeCategory = details.recipeCategory.toLowerCase();
            details.numStep = details.recipeInstructions.length;
            
            if(details.description.match(/pesc/) !== null){
                details.mainIngredient = 'pesce';
            }else if((details.description.match(/carn/) !== null)){
                details.mainIngredient = 'carne';
            }
            
            details.ingredients = details.recipeIngredient.map(function(ingredient) {
                return ingredient.replace(/(q\.b\.|\d+\s+g|[\d.]+|[\d.]+\s\w+$|\d+$|kg|rametti|spicchi|l$|\&\w+;$)/g, '').trim().toLowerCase();
            }).filter(distinct);

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


//..............................

/**
 * @description get the correct sanitized value from html 'tag'
 * @param {Object} tag cheerio HTML node
 * @returns {string} tag microdata value
 */
function getPropValue(tag) {
  var value;

  if ($(tag).attr('content')) {
    value = $(tag).attr('content');
  } else if ($(tag).attr('itemprop') === 'image' && $(tag).attr('src')) {
    value = $(tag).attr('src');
  } else if ($(tag).attr('itemprop') === 'availability' && $(tag).attr('href')) {
    value = $(tag).attr('href').split('/')[3]
  } else {
    value = $(tag).text().replace(/[\n\t\r]+/g, '').replace(/ +(?= )/g, '');
  }
  return value.trim();
}

/**
 * @description Returns array item with provided id
 *
 * @param {Array} items Collection of objects having id property
 * @param {string} id Id of the object to search
 *
 * @returns {Object} Item with provided id
 */
function arraySearch(items, id) {
  for (var i = 0; i < items.length; i++)
    if (items[i].id === id) {
      return items[i];
    }
}

/**
 * @description process given itemtype item and puts it into provided collection for processed items
 *
 * @param {Object} item cheerio HTML node
 * @param {Array} processedItems Collection with already processed items
 */
function processItemtype(item, processedItems) {
  processedItems.push({
    'id':         md5($(item).html()),
    'name':       $(item).attr('itemtype'),
    'properties': {}
  });

}

/**
 * @description process given itemprop item and puts it into provided collection for processed items
 *
 * @param {Object} item cheerio HTML node
 * @param {Array} processedItems Collection with already processed items
 */
function processItemprop(item, processedItems) {
  var property, value, itemtypeHtml, currentItem;

  itemtypeHtml = $(item).parents("[itemtype]").html();

  if (itemtypeHtml) {
    property = $(item).attr('itemprop');
    value    = getPropValue(item);

    currentItem   = arraySearch(processedItems, md5(itemtypeHtml));

    if (currentItem.properties[property]) {
      if (!Array.isArray(currentItem.properties[property])) {
        currentItem.properties[property] = [currentItem.properties[property]];
      }
      currentItem.properties[property].push(value);
    } else {
      currentItem.properties[property] = value;
    }
  }
}
