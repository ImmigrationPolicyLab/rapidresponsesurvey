# Rapid Response Survey

This repository supports generating dictionaries from Twilio templates, and creating Twilio template translations given a completed dictionary. Template translation dictionaries must be populated manually.

### Create a new flow from a Twilio parent flow
`node create-new-dictionary.js [path to parent template] [string to use as file name] "[Title of the dictionary]" [path to folder where dictionary will be created]`

Example: `node create-new-dictionary.js ../parent-flow/my-parent-flow.json new-dictionary "New Dictionary!" ../Dictionaries/`

### Complete valid Twilio flow dictionary

Translate the questions for the survey based on the translations added to the dictionary with the parent flow. Make sure to fill out all fields with the appropriate translation in order to get a complete flow when translated.

### Generate Twilio flow translations given a dictionary and associated parent flow

To create translated flows, you must provide the function with a few parameters values. This will allow the function to access the values it needs to create the new flows. Each paramater value is described on a new line below for clariy. However, when the user is ready to run the code in the terminal, the node command must be entered with no new line breaks as the example shows.

**Parameter Definitions**
`node create-flow-translations.js` - Run code in the create-flow-translations file
`[path to parent template]` - Provide the that to the parent template
`[path to dictionary]` - Provide the path to the dictionary being used for translations
`[flow-file-prefix]` - Provide a file prefix for each flow, this will be used when created the language flow files
`[flow description]` - Provide a description for each flow that will be added to the flow json
`[../new-folder-with-path-for-translated-flows]` - Provide a path to and a new folder where all the translated flows will be stored

**Example**
`node create-flow-translations.js ../parent-flow/LIRS_test_Aug17_updatedfxn.json ../Dictionaries/new-test-dictionary-dictionary-1.0.json test-flow-08-22 "My New Flow" ../directory-for-flows`

### Updating a dictionary with new question fields
If a new questions is added to the flow and the dictionary needs to be updated, without loosing the existing translations, run this function. If a new question is found, the console will alert that it found a new questions. The original dictionary WILL NOT be altered. Instead, a copy of the dictionary will be made, the new questions will be added, and a new file will be created with the updated questions. If desired, the original dictionary can be deleted after the update was made successfully.

What needs to be provided to run this logic in the terminal and create the new dictionary:
`node create-updated-dictionary.js [path-to-parent-flow] [path-to-existing-dictionary] [destination-path-where-new-dictionary-will-be-created] [name-of-new-dictionary]`

Example: `node create-updated-dictionary.js ../parent-flow/LIRS_test_Aug17_updatedfxn.json ../Dictionaries/LIRS-dictionary-test-Aug17-dictionary-1.0.json ../Dictionaries/ updated-dictionary`

### Upload your Twilio flow translations to Twilio


### Mimic API calls to test throttling

Example:
1. Create a file named`.env` at the root level (your project )
2. Enter in you google credentials into the .env file as:
    `CLIENT_EMAIL=twiliotest@tet.gserviceaccount.com`
    `PRIVATE_KEY=xxx`

3. Update the number of calls in the `mock-twilio-handler-events.js` file.
4. Run `node mock-twilio-handler-events.js` in terminal.

Errors that show on you console or terminal reflect google api errors.