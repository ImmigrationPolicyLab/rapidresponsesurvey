#!/bin/bash
# Demonstrate how read actually works

echo "$1" "$2"
read -p 'You have requested to translate a twilio flow.'
echo 'You entered this path for the source flow: ' $1
echo 'You entered this path for the dictionary: ' $2
read -p 'Please provide a file prefix for each file created. This will also be used as the name for the flow folder: ' filePrefix
read -p 'Please provide a desciption to use when created the generated files : ' sourceFlow
echo 'Now creating translated flows...'

echo $filePrefix
node create-flow-translations.js $1 $2 $filePrefix $description
