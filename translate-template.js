const fs = require("fs");

class TwilioFlowTranslation {
  constructor(parentTemplatePath, prevVersion, version) {
    (this.parentTemplatePath = parentTemplatePath),
      (this.prevVersion = prevVersion),
      (this.version = version),
      (this.masterLang = "EN"),
      (this.languages = ["EN", "ES-US", "FR", "AR", "Farsi", "RU", "Swahili"]);
  }

  async generateFlows(
    dictionaryPath,
    description,
    filePrefix,
    folderDestination
  ) {
    try {
      await this.makeDirectory(folderDestination);
      // await this.createUpdatedDictionary();
      const languageFlows = this.languages.map((language) => {
        return this.createNewFlow(
          language,
          dictionaryPath,
          filePrefix,
          folderDestination
        );
      });

      await Promise.all(languageFlows);
      console.log(`Successfully created translated flows from dictionary ${dictionaryPath}!`);
    } catch (error) {
      console.error("Something went wrong attempting to create translated flows: ", error);
    }
  }

  async createUpdatedDictionary(parentFlowPath, originalDictionaryPath, newDictionaryFile) {
    const parentFlow = await this.readFile(parentFlowPath);
    const originalDictionary = await this.readFile(originalDictionaryPath);

    const dictionary = { ...originalDictionary };
    parentFlow.states.forEach((state) => {
      if (!dictionary[state.name] && state.properties && state.properties.body) {
        // Create new entry for any widget that is not help or error
        if(! (state.name.includes("error") || state.name.includes("help")) ) {
          console.log("Found new entry in dictionary: ", state.name);
          const entry = this.createDictionaryEntry(state);
          dictionary[state.name] = entry;
        }
      }
    });

    const file = `${newDictionaryFile}.json`;
    return fs.writeFile(file, JSON.stringify(dictionary), (error) => {
      console.error("Failed to create updated dictionary", error);
      return error;
    });
  }

  async createNewDictionaryFromTemplate(title, filename, fileDestination) {
    try {
      const template = await this.readFile(this.parentTemplatePath);
      const dictionary = {
        title,
        filename,
        version: this.version,
        date: new Date()
      };

      template.states.forEach((state) => {
        if (
          !dictionary[state.name] &&
          state.properties &&
          state.properties.body
        ) {
          const entry = this.createDictionaryEntry(state);
          if (state.name.includes("error")) {
            if (!dictionary.error) {
              dictionary.error = entry;
            }
          } else if(state.name.includes("help")) {
            if (!dictionary.help) {
              dictionary.help = entry;
            }
          } else {
            dictionary[state.name] = entry;
          }
        }
      });

      console.log("created dictionary");

      await this.writeFile(
        `${fileDestination}/${filename}-dictionary-1.0.json`,
        JSON.stringify(dictionary)
      );
      console.log("Successfully created dictionary");
    } catch (error) {
      console.error("Something went wrong when attempt to create dictionary");
    }
  }

  // TODO: finalize validation for dictionary
  static validateParsedDictionary (dictionary) {
    // assume dictionary is already parsed
    for(const field in dictionary) { // loop through questions
      if(field.dictionary) {
        for(const lang in field.dictionary) { // loop through languages
          for(const textField in field.dictionary[lang]) { // loop through text fields
            if(field.dictionary[lang][textField].length <= 1) {
              console.error(`Found no translation for widget: ${field}, language: ${lang}, property: ${textField}.`);
              throw new Error(`Dictionary is not complete. Please ensure all fields have valid translations and try again.`);
            }
          }
        }
      }
    }
  }

  async createNewFlow(
    language,
    dictionaryPath,
    filePrefix,
    folderDestination
  ) {
    const template = await this.readFile(this.parentTemplatePath);
    const translateTemplate = { ...template };
    const dictionary = await this.readFile(dictionaryPath);
    translateTemplate.states.forEach(state => {
      if (state.properties && state.properties.body) {
        if (state.name.includes("error")) {
          state.properties.body = dictionary.error.dictionary[language].text;
        } else if(state.name.includes("help")) {
          state.properties.body = dictionary.help.dictionary[language].text;
        } else {
          const text = Object.values(
            dictionary[state.name].dictionary[language]
          ).join("\n");
          state.properties.body = text;
        }
      }
    });
    const file = `${folderDestination}/${filePrefix}-flow-${language}.json`;
    return this.writeFile(file, JSON.stringify(translateTemplate));
  }

  writeFile(path, data) {
    console.log("path", path);
    return new Promise((resolve, reject) => {
      return fs.writeFile(path, data, (error) => {
        if(error) {
          console.error("Error writing file: ", path);
          reject(error);
        } else {
          resolve();
        }
      })
    });
  }

  async readFile(path) {
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

  async makeDirectory(directory) {
    return new Promise((resolve, reject) => {
      fs.mkdir(directory || this.version, (error) => {
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

    // dictionaryEntry.dictionary[this.masterLang] = templateState.properties && templateState.properties.body;

    this.languages.forEach((language) => {
      dictionaryEntry.dictionary[language] = {};

      bodyParts.forEach((subString, i) => {
        if (i === 0) {
          if (language === this.masterLang) {
            dictionaryEntry.dictionary[language].text = subString;
          } else {
            dictionaryEntry.dictionary[language].text = " ";
          }
        } else {
          if (language === this.masterLang) {
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
