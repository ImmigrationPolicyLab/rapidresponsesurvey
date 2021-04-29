/* eslint-disable class-methods-use-this */
const fs = require("fs");

class TwilioFlowTranslation {
  constructor(parentTemplatePath, languageList, sourceLanguage = "EN") {
    this.parentTemplatePath = parentTemplatePath,
      this.sourceLanguage = sourceLanguage,
      this.languages = languageList;
  }

  async generateFlows(
    dictionaryPath,
    description,
    filePrefix
  ) {
    try {
      const template = await this.readFile(this.parentTemplatePath);
      const dictionary = await this.readFile(dictionaryPath);
      await this.makeDirectory(`./output/flows/${filePrefix}`);

      this.setLanguagesFromDictionary(dictionary);

      const languageFlows = this.languages.map((language) => {
        const flow = TwilioFlowTranslation.createNewFlow(
          language,
          dictionary,
          template,
          description,
        );
        const file = `./output/flows/${filePrefix}/${filePrefix}-flow-${language}.json`;
        return this.writeFile(file, JSON.stringify(flow));
      });

      await Promise.all(languageFlows);
      console.log(`Successfully created translated flows from dictionary ${dictionaryPath}! ` +
      `Check the output/flows folder for the translated flows.`);
    } catch (error) {
      console.error("Something went wrong attempting to create translated flows: ", error);
    }
  }

  static createNewFlow(language, dictionary, template, description) {
    const translateTemplate = { ...template };
    translateTemplate.description = `${description}, Language: ${language}`;

    const errors = [];

    translateTemplate.states.forEach((state) => {
      const { name, properties } = state;
      if (properties && properties.body) {
        const isValidState = dictionary[name] && dictionary[name].dictionary;
        const hasValidTranslation = isValidState
          && TwilioFlowTranslation.validateTranslationsForEntry(dictionary[name].dictionary[language]);

        if (!isValidState) {
          errors.push(`Could not find entry '${name}' in dictionary.`);
        } else if (!hasValidTranslation) {
          errors.push(`Could not find one or more ${language} translations for entry '${name}' in dictionary.`);
        } else {
          // Validated dictionary entry, proceed with translation
          const body = Object.values(dictionary[name].dictionary[language]).join("\n");
          state.properties.body = body;
        }
      }
    });

    if (errors.length) {
      const errorMessage = errors.join("\n")
        .concat("Please check the dictionary provided for errors listed above and try again.");
      throw new Error(errorMessage);
    }

    return translateTemplate;
  }


  async createUpdatedDictionary(originalDictionaryPath, fileName, title) {
    try {
      const parentFlow = await this.readFile(this.parentTemplatePath);
      const originalDictionary = await this.readFile(originalDictionaryPath);

      // Set languages from dictionary
      this.setLanguagesFromDictionary(originalDictionary);
      const dictionary = { ...originalDictionary };
      dictionary.title = title;

      const newEntries = [];
      parentFlow.states.forEach((state) => {
        if (!dictionary[state.name] && state.properties.body) {
          newEntries.push(state.name);
          const entry = this.createDictionaryEntry(state);
          dictionary[state.name] = entry;
        }
      });

      if (newEntries.length) {
        console.log("Found the following new entries in dictionary: ", newEntries.join(", "));
        const file = `./output/dictionaries/${fileName}-dictionary.json`;
        await this.writeFile(file, JSON.stringify(dictionary));
        console.log("Successfully created dictionary. Check the output/dictionary folder for the dictionary.");
      } else {
        console.log("Did not find new entries for dictionary. Did not create updated dictionary.");
      }
      return dictionary;
    } catch (error) {
      console.error(`Something went wrong when attempt to create dictionary: ${error}`);
    }
  }

  setLanguagesFromDictionary(dictionary) {
    let entry = Object.keys(dictionary)[2];
    if (!(dictionary[entry] instanceof Object)) {
      entry = Object.keys(dictionary)[3];
    }
    this.languages = Object.keys(dictionary[entry].dictionary);
  }

  async createNewDictionaryFromTemplate(title, filename) {
    try {
      const template = await this.readFile(this.parentTemplatePath);
      const dictionary = {
        title,
      };
      template.states.forEach((state) => {
        if (
          !dictionary[state.name] &&
          state.properties &&
          state.properties.body
        ) {
          const entry = this.createDictionaryEntry(state);
          dictionary[state.name] = entry;
        }
      });

      await this.writeFile(
        `./output/dictionaries/${filename}-dictionary.json`,
        JSON.stringify(dictionary)
      );
      console.log("Successfully created dictionary! Check the output/dictionary folder for the dictionary.");
    } catch (error) {
      console.error(`Something went wrong when attempt to create dictionary: ${error}`);
    }
  }

  // "Private" helper functions
  static validateTranslationsForEntry(entryObject) {
    for (let key in entryObject) {
      if (!entryObject[key] || entryObject[key].length === 0) {

        return false;
      }
    }
    return true;
  }

  writeFile(path, data) {
    console.log("Writing new file at: ", path);
    return new Promise((resolve, reject) => {
      return fs.writeFile(path, data, (error) => {
        if (error) {
          console.error("Error writing file: ", path);
          reject(error);
        } else {
          resolve();
        }
      })
    });
  }

  readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (error, data) => {
        if (error) {
          console.error("Error reading in file: ", path);
          reject(error);
        }
        resolve(JSON.parse(data));
      });
    });
  }

  makeDirectory(directory) {
    return new Promise((resolve, reject) => {
      fs.mkdir(directory, (error) => {
        if (error) {
          console.error("Error making directory: ", directory);
          reject(error);
        }
        resolve();
      });
    });
  }

  createDictionaryEntry(templateState) {
    const dictionaryEntry = {
      type: templateState.type,
      dictionary: {}
    };

    const bodyParts =
      templateState.properties && templateState.properties.body.split("\n");

    this.languages.forEach((language) => {
      dictionaryEntry.dictionary[language] = {};

      bodyParts.forEach((subString, i) => {
        if (i === 0) {
          if (language === this.sourceLanguage) {
            dictionaryEntry.dictionary[language].text = subString;
          } else {
            dictionaryEntry.dictionary[language].text = " ";
          }
        } else {
          if (language === this.sourceLanguage) {
            dictionaryEntry.dictionary[language][`option-${i}`] = subString;
          } else {
            dictionaryEntry.dictionary[language][`option-${i}`] = " ";
          }
        }
      });
    });

    return dictionaryEntry;
  }
}

module.exports = { TwilioFlowTranslation };
