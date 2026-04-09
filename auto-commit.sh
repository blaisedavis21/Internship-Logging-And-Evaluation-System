#!/bin/bash

while true
do
    git add .
    git commit -m "Auto commit: $(date)"
    git push
    echo "Committed & pushed at $(date)"
    sleep 10
done