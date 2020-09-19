/* eslint-disable class-methods-use-this */
const fs = require("fs");

class TwilioFlowTranslation {
  constructor(parentTemplatePath, languageList, sourceLanguage) {
    this.parentTemplatePath = parentTemplatePath,
      this.parentLang = sourceLanguage || "EN",
      this.languages = languageList || ["EN", "ES-US", "FR", "AR", "Farsi", "RU", "Swahili"];
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
      console.log(`Successfully created translated flows from dictionary ${dictionaryPath}!`);
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
          errors.push(`Could not find ${language} translation for entry '${name}' in dictionary. `);
        } else {
          // Validated dictionary entry, proceed with translation
          const body = Object.values(dictionary[name].dictionary[language]).join("\n");
          state.properties.body = body;
        }
      }
    });

    if (errors.length) {
      const errorMessage = errors.join(" ")
        .concat("Please check the dictionary provided for errors listed above and try again.");
      throw new Error(errorMessage);
    }

    return translateTemplate;
  }


  async createUpdatedDictionary(parentFlowPath, originalDictionaryPath, fileDestination, fileName) {
    try {
      const parentFlow = await this.readFile(parentFlowPath);
      const originalDictionary = await this.readFile(originalDictionaryPath);

      const dictionary = { ...originalDictionary };
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
        const file = `${fileDestination}/${fileName}.json`;
        await this.writeFile(file, JSON.stringify(dictionary));
        console.log("Successfully created dictionary");
      } else {
        console.log("Did not find new entries for dictionary. Did create updated dictionary.");
      }
      return dictionary;
    } catch (error) {
      console.error(`Something went wrong when attempt to create dictionary: ${error}`);
    }
  }

  async createNewDictionaryFromTemplate(title, filename, fileDestination) {
    try {
      const template = await this.readFile(this.parentTemplatePath);
      const dictionary = {
        title,
        filename,
        version: this.version,
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
        `${fileDestination}/${filename}-dictionary-1.0.json`,
        JSON.stringify(dictionary)
      );
      console.log("Successfully created dictionary!");
    } catch (error) {
      console.error(`Something went wrong when attempt to create dictionary: ${error}`);
    }
  }

  // "Private" helper functions
  static validateTranslationsForEntry(entryObject) {
    for (let key in entryObject) {
      if (!entryObject[key] || entryObject[key].length <= 1) {
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
          if (language === this.parentLang) {
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
