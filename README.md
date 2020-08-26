# Rapid Response Survey

This repository supports generating dictionaries from Twilio templates, and creating Twilio template translations given a completed dictionary. Template translation dictionaries must be populated manually.

### Creat a new flow from a Twilio parent flow
`node create-new-dictionary.js [path to parent template] [string to use as file name] "[Title of the dictionary]" [path to folder where dictionary will be created]`

Example: `node create-new-dictionary.js ../parent-flow/my-parent-flow.json new-dictionary "New Dictionary!" ../Dictionaries/`

### Complete valid Twilio flow dictionary

Translate the questions for the survey based on the translations added to the dictionary with the parent flow. Make sure to fill out all fields with the appropriate translation in order to get a complete flow when translated.

### Generate Twilio flow translations given a dictionary and associated parent flow

`node create-new-dictionary.js [path to parent template] [path to dictionary] [flow-file-prefix] "[flow description]" [new folder with path that will be created to store translated flows]`

Example: `node create-flow-translations.js ../parent-flow/LIRS_test_Aug17_updatedfxn.json ../Dictionaries/new-test-dictionary-dictionary-1.0.json test-flow-08-22 "my new flow" ../directory-for-flows`

### Upload your Twilio flow translations to Twilio