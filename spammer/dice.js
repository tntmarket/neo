var request = require('request');
var sqlite3 = require('sqlite3'); 
var cheerio = require('cheerio');
var crypto = require('crypto');

log = console.log;

var cookie = '';

function play() {
   request.post('http://www.neopets.com/games/play_dicearoo.phtml', {
      form: {
         'type'    : 'start',
         'raah'    : 'init',
         '_ref_ck' : 'c45a23706949d5131306d76d6ffb3999'
      },
      headers: {
         'Cookie'  : 'neologin=' + cookie,
         'Referer' : 'http://www.neopets.com/games/play_dicearoo.phtml',
         'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'
      }
   }, function(err, res, body) {
      if (err || res.statusCode != 200) {
         console.log('HTTP GOT FUCKED');
      } else if(body.match(/BORED/)) {
         console.log('The Muthafucka is BORED');
      } else {
         setTimeout(play, Math.random()*200+80);
      }
      var $ = cheerio.load(body);
      result = $('table[align="center"]');
      major = result.find('b').text();
      minor = result.find('i').text();
      console.log(major + (new Array(30 - major.length)).join(' ') + minor);
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
            play();
         });
   }); 
}

getLogin();


