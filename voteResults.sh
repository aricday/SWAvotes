#!/bin/bash

node Votes.js

a=1;

while [ $a -lt 16 ]
do
	echo "Results for Team #"$a
    sort -u -t"|" -k 1,1  vote.txt | awk -F"|" -v TEAM=$a '$2==TEAM' | wc -l
    echo "***************"
    a=`expr $a + 1`
done

echo "** END of RESULTS **"


