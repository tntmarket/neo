var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var sqlite3 = require('sqlite3'); 
var crypto = require('crypto');

log = console.log;

function dumpResponse(body) {
   fs.writeFile('debug.html', body, function(err) {
      if(err) {
         console.log('debug.html FUCKED UP!');
      }
   });
}

var cookie = '';

function fetchItems(pagesToScan) {
   if(pagesToScan.length === 0) {
      console.log('done');
      return;
   }

   page = pagesToScan.pop();
   console.log('Page ' + page + '');
   request('http://www.neopets.com/market.phtml', {
      qs: {
         'type'     : 'your',
         'lim'      : page*30 
      },
      headers: {
         'Cookie'    : 'neologin=' + cookie 
      }
   }, function(err, res, body) {
      if (err || res.statusCode != 200) {
         console.log('HTTP GOT FUCKED');
         return;
      }

      var $ = cheerio.load(body);
      dumpResponse($('html'));

      if(page === 1) {
         var numItemsDom = $('[action="market.phtml"]').eq(0).text()
             .trim().replace(/,/g,'').split(' ');
         var numItems = parseInt(numItemsDom[numItemsDom.length - 1]);
         for(i = 2; i <= Math.ceil(numItems/30) ; i++) {
            pagesToScan.push(i);
         }
      }
      var items = {};
      var itemDoms = $('input[name^="obj_id"]').each(function() {
         var el = $(this);
         var id = el.attr('value');
         items[id] = {
            price: el.next().attr('value')
         };
         estimatePrice(items, id);
      });
      log(items);
      fetchItems(pagesToScan);
   });
}

function estimatePrice(items, itemId) {
   request('http://www.neocodex.us/forum/itemdb/' + itemId, 
   function(err, res, body) {
      if (err || res.statusCode != 200) {
         console.log('HTTP GOT FUCKED');
         return;
      }

      var $ = cheerio.load(body);
      items[itemId].estimate = $('price_display').text();
   });
}

function getLogin() {
   var db = new sqlite3.Database(
      '/home/dave/.config/google-chrome/Default/Cookies');

   var key = crypto.pbkdf2Sync('peanuts', 'saltysalt', 1, 128/8);
   var iv = new Buffer((new Array(17)).join(' '), 'binary');
   var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
   var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);

   db.each('SELECT encrypted_value FROM cookies' + 
           '   WHERE name="neologin" AND' +
           '         host_key LIKE "%neopets.com%"', function(err, row) {
      var encrypted = row.encrypted_value.slice(3);
      decipher.write(encrypted);
      decipher.end();

      decipher
         .on('data', function(chunk) { cookie += chunk.toString(); })
         .on('error', function(err) { log('gg'); })
         .on('end', function() {
            console.log(cookie);
            fetchItems([1]);
         });
   }); 
}
getLogin();


