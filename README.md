# Rapid Response Survey

This repository supports generating dictionaries from Twilio templates, and creating Twilio template translations given a completed dictionary. Template translation dictionaries must be populated manually.

### Creat a new template from a Twilio parent template
`node create-new-dictionary.js "[path to parent template]" "[Title of the dictionary]" "[file-name-for-the-dictionary]"`

Example: `node create-new-dictionary.js "./parent-templates/master-template.json" "test-dictionary.js" "New Dictionary"`

### Complete a Twilio template dictionary

`node create-new-dictionary.js "[path to parent template]" "[path to dictionary]" "[flow file prefix]" "[flow description]" "[folder to store translated flows]"`

Example: `node create-flow-translations.js "./parent-flow/LIRS_test_Aug17_updatedfxn.json" "./dictionaries/LIRS-dictionary-test-Aug17-dictionary-1.0.json" "test-flow-1.0" "Test flow" "./test-folder"`

### Generate Twilio template translations given a dictionary and associated parent template


### Upload your Twilio template translations to Twilio