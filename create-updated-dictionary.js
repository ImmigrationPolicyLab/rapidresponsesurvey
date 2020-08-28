const { TwilioFlowTranslation }  = require("./translate-template.js");

const parentFlow = process.argv[2];
const originalDictionaryPath = process.argv[3];
const newDictionaryFileNamePath = process.argv[4];

const flowTransation = new TwilioFlowTranslation(parentFlow);

flowTransation.createUpdatedDictionary(parentFlow, originalDictionaryPath, newDictionaryFileNamePath);