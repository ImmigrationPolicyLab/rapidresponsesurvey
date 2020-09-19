const { TwilioFlowTranslation }  = require("./src/translate-template.js");

const parentTemplatePath = process.argv[2];
const filename = process.argv[3];
const title = process.argv[4];
const fileDestination = process.argv[5];


console.log("Parent Template Path: ", parentTemplatePath);

const flowTransation = new TwilioFlowTranslation(parentTemplatePath);

flowTransation.createNewDictionaryFromTemplate(title, filename, fileDestination);