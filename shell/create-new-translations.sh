#!/bin/bash

echo 'You have requested to translate a Twilio Flow.'
echo 'You entered this path for the source flow: ' $1
echo 'You entered this path for the dictionary: ' $2
read -p 'Please provide a file prefix for each file created. This will also be used as the name for the folder name: ' filePrefix
read -p 'Please provide a description to use with the translated flows : ' sourceFlow
echo 'Now creating translated flows...'

echo $filePrefix
node create-flow-translations.js $1 $2 $filePrefix $description
