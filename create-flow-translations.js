/* eslint-disable no-undef */
const { TwilioFlowTranslation }  = require("./translate-template.js");

// eslint-disable-next-line no-undef
const parentFlowPath = process.argv[2];
const dictionary = process.argv[3];
const filePrefix = process.argv[4];
const description = process.argv[5];
const flowFolderName = process.argv[6];


console.log("Parent Template Path: ", parentFlowPath, dictionary);
console.log("Dictionary: ", dictionary);


const templateFlow = new TwilioFlowTranslation(parentFlowPath);

templateFlow.generateUpdatedTemplates(dictionary, description, filePrefix, flowFolderName);