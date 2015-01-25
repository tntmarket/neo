#!/bin/sh

# 1  - Food 
# 7  - Books 
# 14 - Chocolate 
# 15 - Bakery 

# 2  - Magic
# 10 - Defence 
# 68 - Coins 
# 58 - Stamps
# 73 - Meridell pots

# 37 - Snow Food 

rm *.txt

node genList 1500 1 14 7 #14 37

#node genList 10000 10

node genList 5000 73

#node genList 10000 dunno igloo attic
#cat dunno.txt igloo.txt > Igloo.txt
#cat dunno.txt attic.txt > Attic.txt
#rm igloo.txt attic.txt dunno.txt
unix2dos *.txt
cp *.txt ~/NP

