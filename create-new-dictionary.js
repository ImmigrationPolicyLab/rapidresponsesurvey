const { TemplateTranslation }  = require("./translate-template.js");

const parentTemplatePath = process.argv[2];
const filename = process.argv[3];
const title = process.argv[4];


console.log("Parent Template Path: ", parentTemplatePath);

const templateTransation = new TemplateTranslation(parentTemplatePath);

templateTransation.createNewDictionaryFromTemplate(title, filename);