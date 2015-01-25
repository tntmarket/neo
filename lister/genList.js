var request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs');

var shopNumbers = process.argv.slice(3);

var PAGE_SIZE = 100,
    minProfit = parseInt(process.argv[2]);

function getShopNumber(shopNumber) {
   if(shopNumber === 'igloo' || shopNumber === 'attic' || 
      shopNumber === 'dunno') {
      return '';
   } else {
      return shopNumber;
   }
}

function getRarityLow(shopNumber) {
   if(shopNumber === 'igloo') {
      return 1;
   } else if(shopNumber === 'attic') {
      return 80;
   } else if(shopNumber === 'dunno') {
      return 0;
   } else {
      return '';
   }
} 

function getRarityHigh(shopNumber) {
   if(shopNumber === 'igloo') {
      return 89;
   } else if(shopNumber === 'attic') {
      return 99;
   } else if(shopNumber === 'dunno') {
      return 0;
   } else {
      return '';
   }
} 

console.log('Min profit: ' + minProfit);
function genList(shopNumbers) {
   if(shopNumbers.length === 0) {
      return;
   }
   var shopNumber = shopNumbers.pop();
   var buyList = [],
       page;

   function addItems(priceLow, priceHigh, cb) {
      request.post('http://www.neocodex.us/forum/index.php', {
         form: {
            'app'         : 'itemdb',
            'module'      : 'search',
            'section'     : 'search',
            'item'        : '',
            'description' : '',
            'rarity_low'  : getRarityLow(shopNumber),
            'rarity_high' : getRarityHigh(shopNumber),
            'price_low'   : priceLow, 
            'price_high'  : priceHigh, 
            'shop'        : getShopNumber(shopNumber),
            'search_order': 'profit',
            'st'          : (page-1)*PAGE_SIZE,
            'sort'        : 'desc',
            'lim'         : PAGE_SIZE
         },
         headers: {
            'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'
         }
      }, function(err, res, body) {
         if (err || res.statusCode != 200) {
            console.log('HTTP GOT FUCKED');
            return;
         }
         var $ = cheerio.load(body);

         var nextPage = true;
         $('.ipsList_inline.ipsList_reset.short').children().each(function() {
            var el = $(this),
                name = el.find('.desc').find('a').text().trim(),
                price = parseInt(
                   el.find('.idbQuickPrice').text().
                   trim().replace(/,/g,'').slice(0,-3)
                ),
                profit = parseInt(
                   el.find('font').text().trim().replace(/,/g,'').slice(0,-3)
                );

            if(isNaN(profit) || (profit >= minProfit && profit/price >= 0.15)) {
               buyList.push(name);
            } else {
               nextPage = false;
               return false;
            }
         });

         var pagerText = $('.pagejump').find('a').text().split(' '),
             currentPage = parseInt(pagerText[1]),
             numPages = parseInt(pagerText[3]);

         console.log(shopNumber + ': ' + currentPage + '/' + numPages);

         if(nextPage && pagerText && currentPage < numPages) {
            page++;
            setTimeout(
               addItems.bind(null, priceLow, priceHigh, cb),
               Math.random()*200 + 100
            );
         } else {
            cb(buyList);
         }
      });
   }

   function addUnpricedItems() {
      page = 1;
      addItems(0, 0, addPricedItems);
   }

   function addPricedItems() {
      page = 1;
      addItems('', '', dumpList);
   }

   function dumpList(itemNames) {
      var fileName = shopNumber + '.txt'; 
      fs.writeFile(fileName, itemNames.join('\n'), function(err) {
         console.log('');
         if(err) {
            console.log(fileName + ' FUCKED UP!');
         } else {
            console.log('Generated ' + fileName + ' with ' +
                        itemNames.length + ' items');
         }
      });
      genList(shopNumbers);
   }

   addUnpricedItems();
}

genList(shopNumbers);
