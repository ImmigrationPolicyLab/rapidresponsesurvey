/* eslint-disable no-undef */
const { TwilioFlowTranslation }  = require("./src/translate-template.js");

const parentFlow = process.argv[2];
const originalDictionaryPath = process.argv[3];
const fileName = process.argv[4];
const title = process.argv[5];

console.log(parentFlow, originalDictionaryPath, fileName, title);

const flowTransation = new TwilioFlowTranslation(parentFlow);

flowTransation.createUpdatedDictionary(originalDictionaryPath, fileName, title);
