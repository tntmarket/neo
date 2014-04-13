function *crap(d) {
   var y = d;

   yield y;
   y += d;
   yield y;
   y += d;
   yield y;

   return 1337;
}

gen = crap(1);
gen.next();
gen.next();
gen.next();
gen.next();
