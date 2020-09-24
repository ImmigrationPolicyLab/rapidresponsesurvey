#!/bin/bash

read -p 'Starting process to create updated dictionary '
echo 'You entered this path for the source flow: ' $1
echo 'You entered this path for the existing dictionary: ' $2
read -p 'Please provide a title to use when creating the updated dictionary: ' title
read -p 'Please provide a file name for the updated dictionary you are creating: ' fileName
echo 'Now attempting to create a new dictionary from the source flow...'

node create-updated-dictionary.js $1 $2 $fileName $title
