#! /bin/sh

URL="http://www.neopets.com/space/gormball2.phtml"
COOKIE="Cookie: np_randseed=96194005063336402; xt6Yr4e33D=574879424457992364886; btg_device=m:0,t:0; vmn_poe=6x6; PHPSESSID=9206b15292cf7df02ba164bdfc9ab757; bd2logstaysopen=1; s_nr=1396449894833; geoCountry=CA; vmn_fwblocked=off; cshopxpz=2014-04-03; mtvn_btg_tnt=; s_sq=%5B%5BB%5D%5D; s_ppv=100; s_cc=true; s_fid=40789A898EF58C29-1C0AEF9973F17244; mbox=PC#1396462656419-387804.25_04#1397952310|session#1396735714140-818580#1396744570|check#true#1396742770; ld_tntmarket=2014-04-02; np_uniq_tntmarket=2014-04-07; np_uniq=2014-04-10; ld_=2014-04-09; np_uniq_=2014-04-10; npuid=120070720c0020v7e0036606a0060e100000676663046f7000047000050000f0; ld_lorentzfactor=2014-04-09; np_uniq_lorentzfactor=2014-04-10; ssotoken=44f485230f57ec3832177d858a8a4b59AAABRVGKAkQ; neoremember=lorentzfactor; neologin=lorentzfactor%2B382098cd545258fc9d212de4f5208fd9c02f3f5d; toolbar=lorentzfactor%2BC%2B382098cd545258fc9d212de4f5208fd9c02f3f5d; _tz=240; __utma=258639253.2092894017.1396424448.1397154519.1397189144.45; __utmb=258639253.42.10.1397189144; __utmc=258639253; __utmz=258639253.1396427153.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided)"
USER_AGENT="User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36"
ORIGIN="Origin: http://www.neopets.com"
ACCEPT_ENCODING="Accept-Encoding: gzip,deflate,sdch"
ACCEPT_LANGUAGE="Accept-Language: en-US,en;q=0.8"
CONTENT_TYPE="Content-Type: application/x-www-form-urlencoded"
ACCEPT="Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
CACHE_CONTROL="Cache-Control: max-age=0"
CONNECTION="Connection: keep-alive"

while :
do
   if curl -s "$URL" -H "$COOKIE" -H "$ORIGIN" -H "$ACCEPT_ENCODING" -H "$ACCEPT_LANGUAGE" -H "$USER_AGENT" -H "$CONTENT_TYPE" -H "$ACCEPT" -H "$CACHE_CONTROL" -H "Referer: http://www.neopets.com/space/gormball2.phtml" -H "$CONNECTION" --data "type=moveon&page_count=23&xcn=e742a782740a00b981462d66a6aaee86&last_character=Ember" --compressed | grep "Error"; then
      if curl -s "$URL" -H "$COOKIE" -H "$ORIGIN" -H "$ACCEPT_ENCODING" -H "$ACCEPT_LANGUAGE" -H "$USER_AGENT" -H "$CONTENT_TYPE" -H "$ACCEPT" -H "$CACHE_CONTROL" -H "Referer: http://www.neopets.com/space/gormball.phtml" -H "$CONNECTION" --data "xcn=e742a782740a00b981462d66a6aaee86&player_backed=1" --compressed | grep "BORED"; then
         break
      fi
   fi
done
