#!/bin/bash
# Demonstrate how read actually works

echo 'Starting process to create a new Twilio Flow Dictionary.'
echo 'You entered this path for the source flow: ' $1
read -p 'Please provide a title to use when creating the dictionary: ' title
read -p 'Please provide a file name for the dictionary you are creating: ' fileName
read -p 'Please enter the languages you would like to include in the dictionary e.g. EN,ES,FR ' languages
echo 'Now attempting to create a new dictionary from the source flow...'

node create-new-dictionary.js $1 $title $fileName $languages