#!/bin/bash
# Demonstrate how read actually works


read -u fd 'Would you like to create a new dictionary? ' response
read -p 'Please enter the path to the parent dictionary: ' parentFlow
read -p 'Please entery the name for this dictionary: ' name

echo response $response parent-flow $parentFlow name $name

