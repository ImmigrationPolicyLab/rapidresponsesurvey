const { TwilioFlowTranslation }  = require("./src/translate-template.js");

const parentFlow = process.argv[2];
const originalDictionaryPath = process.argv[3];
const fileDestination = process.argv[4];
const fileName = process.argv[5];

const flowTransation = new TwilioFlowTranslation(parentFlow);

flowTransation.createUpdatedDictionary(parentFlow, originalDictionaryPath, fileDestination, fileName);