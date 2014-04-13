var request = require('request');
var sqlite3 = require('sqlite3'); 
var cheerio = require('cheerio');
var crypto = require('crypto');

log = console.log;

var cookie = '';

function start() {
   request.post('http://www.neopets.com/space/gormball2.phtml', {
      form: {
         'xcn'            :'c45a23706949d5131306d76d6ffb3999',
         'player_backed'  :'1'
      },
      headers: {
         'Cookie'     : 'neologin=' + cookie,
         'Referer'    : 'http://www.neopets.com/space/gormball.phtml',
         'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'
      }
   }, function(err, res, body) {
      if (err || res.statusCode != 200) {
         console.log('HTTP GOT FUCKED');
      } else if(body.match(/BORED/)) {
         console.log('The muthafucka is BORED');
         return;
      }

      setTimeout(play, Math.random()*200+80);
   });
}

function play(xcn, page_count, last_character) {
   request.post('http://www.neopets.com/space/gormball2.phtml', {
      form: {
         'type'           :'moveon',
         'page_count'     :'107',
         'xcn'            :'c45a23706949d5131306d76d6ffb3999',
         'last_character' :'Zargrold'
      },
      headers: {
         'Cookie'  : 'neologin=' + cookie,
         'Referer' : 'http://www.neopets.com/space/gormball2.phtml'
      }
   }, function(err, res, body) {
      var $ = cheerio.load(body);

      if (err || res.statusCode != 200) {
         console.log('HTTP GOT FUCKED');
      } else if(body.match(/Error:/)) {
         setTimeout(start, Math.random()*200+80);
      } else if(body.match(/explodes on Thyassa/)){
         var winnings = /(\d+) points/.exec($('center').text())[1];
         console.log('LOST, NOOB');
         console.log('Profit : ' + (parseInt(winnings, 10) - 20) + 'NPs');
         setTimeout(start, Math.random()*200+80);
      } else if(body.match(/won!!!/)){
         var winningText = $('center').eq(1).find('p').eq(1).text();
         var winningNps = /(\d+) points/.exec(winningText);
         var itemPrize = /Your Prize : (.+)/.exec(winningText);
         console.log('WINNING');
         console.log('Profit : ' + (parseInt(winningNps[1], 10) - 20) + 'NPs');
         console.log('Item   : ' + itemPrize[1]);
         setTimeout(start, Math.random()*200+80);
      } else {
         setTimeout(play, Math.random()*200+80);
      }

      //log(body);
      //var result = $('form[name="gormform"]');
      //var xcn = result.find('[name="xcn"]').attr('value');
      //var page_count = result.find('[name="page_count"]').attr('value');
      //var last_character = result.find('[name="last_character"]').attr('value');
      var message = $('table[width="480"] td').eq(2).find('b').text().trim();
      var bonus = $('table[width="480"] td').eq(3).text().trim();
      console.log(message);
      if(bonus.length > 0) {
         console.log(bonus);
      }
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
            start();
         });
   }); 
}

getLogin();


