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

### Updating a dictionary with new question fields
If a new questions is added to the flow and the dictionary needs to be updated, without loosing the existing translations, run this function. If a new question is found, the console will alert that it found a new questions. The original dictionary WILL NOT be altered. Instead, a copy of the dictionary will be made, the new questions will be added, and a new file will be created with the updated questions. If desired, the original dictionary can be deleted after the update was made successfully.

What needs to be provided to run this logic in the terminal and create the new dictionary:
`node create-updated-dictionary.js [path-to-parent-flow] [path-to-existing-dictionary] [destination-path-where-new-dictionary-will-be-created] [name-of-new-dictionary]`

Example: `node create-updated-dictionary.js ../parent-flow/LIRS_test_Aug17_updatedfxn.json ../Dictionaries/LIRS-dictionary-test-Aug17-dictionary-1.0.json ../Dictionaries/ updated-dictionary`

### Upload your Twilio flow translations to Twilio