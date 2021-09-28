#!/bin/bash

node Votes.js

echo "Results for Team #1"
sort -u -t"|" -k 1,1  vote.txt | awk -F"|" '$2==1' | wc -l
echo "***************"

echo "Results for Team #2"
sort -u -t"|" -k 1,1  vote.txt | awk -F"|" '$2==2' | wc -l
echo "***************"

echo "Results for Team #3"
sort -u -t"|" -k 1,1  vote.txt | awk -F"|" '$2==3' | wc -l
echo "***************"

echo "Results for Team #4"
sort -u -t"|" -k 1,1  vote.txt | awk -F"|" '$2==4' | wc -l
echo "***************"

echo "Results for Team #5"
sort -u -t"|" -k 1,1  vote.txt | awk -F"|" '$2==5' | wc -l
echo "***************"

echo "Results for Team #6"
sort -u -t"|" -k 1,1  vote.txt | awk -F"|" '$2==6' | wc -l
echo "***************"

echo "Results for Team #7"
sort -u -t"|" -k 1,1  vote.txt | awk -F"|" '$2==7' | wc -l
echo "***************"

echo "Results for Team #8"
sort -u -t"|" -k 1,1  vote.txt | awk -F"|" '$2==8' | wc -l
echo "***************"

echo "Results for Team #9"
sort -u -t"|" -k 1,1  vote.txt | awk -F"|" '$2==9' | wc -l
echo "***************"

echo "** END of RESULTS **"


