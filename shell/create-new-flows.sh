#!/bin/bash
# Demonstrate how read actually works

echo "$1" "$2"
read -p 'Would you like to create a new dictionary? ' response
echo 'You entered this path for you source flow: '
echo 'You entered this path for your dictionary flow: '
read -p 'Please provide a file prefix for each file created. This will also be used as the name for the flow folder: ' filePrefix
read -p 'Please provide a desciption to use when created the generated files : ' sourceFlow
echo 'Now creating translation flows...'

echo $filePrefix
node create-flow-translations.js $1 $2 $filePrefix $description
echo 'Check the output/flows folder for the translated flows.'
