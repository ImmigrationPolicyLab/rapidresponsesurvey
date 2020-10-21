/* eslint-disable no-undef */
const { TwilioFlowTranslation }  = require("./src/translate-template.js");

const parentTemplatePath = process.argv[2];
const title = process.argv[3];
const filename = process.argv[4];
const languages = process.argv[5];

const languageList = languages.split(",");

const flowTransation = new TwilioFlowTranslation(parentTemplatePath, languageList);

flowTransation.createNewDictionaryFromTemplate(title, filename);
