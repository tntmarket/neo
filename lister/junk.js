var request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs');

var PAGE_SIZE = 100,
    minProfit = parseInt(process.argv[2]);

function genList() {
   var buyList = [],
       page = 1;

   function addItems() {
      request.post('http://www.neocodex.us/forum/index.php', {
         form: {
            'app'         : 'itemdb',
            'module'      : 'search',
            'section'     : 'search',
            'item'        : '',
            'description' : '',
            'rarity_low'  : '',
            'rarity_high' : '',
            'price_low'   : 1,
            'price_high'  : 50, 
            'shop'        : '',
            'search_order': 'price',
            'st'          : (page-1)*PAGE_SIZE,
            'sort'        : 'asc',
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
                name = el.find('.desc').find('a').text().trim();

            buyList.push(name);
         });

         var pagerText = $('.pagejump').find('a').text().split(' '),
             currentPage = parseInt(pagerText[1]),
             numPages = parseInt(pagerText[3]);

         console.log(currentPage + '/' + numPages);

         if(nextPage && pagerText && currentPage < numPages) {
            page++;
            setTimeout(addItems, Math.random()*200 + 100);
         } else {
            dumpList(buyList);
         }
      });
   }

   function dumpList(itemNames) {
      fs.writeFile('junk.txt', itemNames.join('|5|1000\n'), function(err) {
         console.log('');
         if(err) {
            console.log('junk.txt FUCKED UP!');
         } else {
            console.log('Generated junk.txt with ' +
                        itemNames.length + ' items');
         }
      });
   }

   addItems();
}

genList();
