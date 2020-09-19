/* eslint-disable no-undef */
const { TwilioFlowTranslation } = require("../translate-template");
const { getMockFlow, getMockFlowWithNewEntry } = require("./mocks/parent-flow.mock");
const getOriginalDictionary = require("./mocks/complete-dictionary.mock");
const newDictionaryMock = require("./mocks/newDictionary.mock");

describe("test code", () => {
  let translationService;
  beforeEach(() => {
    const parentFlowPath = "../";
    translationService = new TwilioFlowTranslation(parentFlowPath);
  });

  describe("createNewDictionaryFromTemplate", () => {

    it("Creates a new dictionary", () => {
      const path = ".";
      const fileName = "file-name";
      const destinationPath = `${path}/${fileName}-dictionary-1.0.json`;
      const mockParentFlow = getMockFlow();
      translationService.languages = ["EN", "ES_US", "FR"];
      translationService.writeFile = jasmine.createSpy("writeFile").and.returnValue(Promise.resolve({}));
      translationService.readFile = jasmine.createSpy("readFile").and.returnValue(
        Promise.resolve(mockParentFlow)
      );

      return translationService.createNewDictionaryFromTemplate("testTitle", fileName, path)
        .then(() => {
          expect(translationService.readFile).toHaveBeenCalledTimes(1);
          expect(translationService.writeFile).toHaveBeenCalledTimes(1);
          expect(translationService.writeFile).toHaveBeenCalledWith(
            destinationPath, JSON.stringify(newDictionaryMock)
          );
        });
    });

    it("", () => {

    });

    it("Logs an error for user if something goes wrong", () => {

    });
  });

  describe("createUpdatedDictionary", () => {
    it("Adds new items to dictionary if new questions are found in flow", () => {
      const path = ".";
      const fileName = "file-name";
      const destinationPath = `${path}/${fileName}-dictionary-1.0.json`;
      const { flow, newEntry } = getMockFlowWithNewEntry();
      const originalDictionary = getOriginalDictionary();
      const originalNumEntries = Object.keys(originalDictionary).length;

      translationService.languages = ["EN", "ES_US", "FR"];

      const loggerSpy = spyOn(console, "log");
      translationService.writeFile = jasmine.createSpy("writeFile").and.returnValue(Promise.resolve({}));
      translationService.readFile = jasmine.createSpy("readFile").and.returnValues(
        flow,
        originalDictionary,
      );

      return translationService.createUpdatedDictionary(".", ".", ".", fileName)
        .then((dictionary) => {
          expect(translationService.readFile).toHaveBeenCalledTimes(2);
          expect(translationService.writeFile).toHaveBeenCalledTimes(1);
          expect(translationService.writeFile).not.toHaveBeenCalledWith(
            destinationPath, JSON.stringify(newDictionaryMock)
          );
          const dictionaryKeys = Object.keys(dictionary);
          expect(dictionaryKeys.length).toEqual(originalNumEntries + 1);
          expect(dictionary[newEntry]).toBeDefined();
          expect(loggerSpy.calls.first().args).toEqual(
            [
              `Found the following new entries in dictionary: `,
              `${newEntry}`
            ]
          );
        });
    });

    it("Does not create a new dictionary if no new items are found", () => {
      const fileName = "file-name";
      const flow = getMockFlow();
      const originalDictionary = getOriginalDictionary();
      const originalNumEntries = Object.keys(originalDictionary).length;

      translationService.languages = ["EN", "ES_US", "FR"];

      const loggerSpy = spyOn(console, "log");
      translationService.writeFile = jasmine.createSpy("writeFile").and.returnValue(Promise.resolve({}));
      translationService.readFile = jasmine.createSpy("readFile").and.returnValues(
        flow,
        originalDictionary,
      );

      return translationService.createUpdatedDictionary(".", ".", ".", fileName)
        .then((dictionary) => {
          expect(translationService.readFile).toHaveBeenCalledTimes(2);
          expect(translationService.writeFile).not.toHaveBeenCalled();
          const dictionaryKeys = Object.keys(dictionary);
          expect(dictionaryKeys.length).toEqual(originalNumEntries);
          expect(loggerSpy).toHaveBeenCalled();
        });
    });

    it("Logs an error for user if something goes wrong reading files", () => {
      const fileName = "file-name";
      const error = new Error("test");

      translationService.languages = ["EN", "ES_US", "FR"];

      const errorLoggerSpy = spyOn(console, "error");
      translationService.readFile = jasmine.createSpy("readFile").and.returnValues(Promise.reject(error));

      return translationService.createUpdatedDictionary(".", ".", ".", fileName)
        .then((dictionary) => {
          expect(dictionary).toBeUndefined();
          expect(translationService.readFile).toHaveBeenCalledTimes(1);
          expect(errorLoggerSpy).toHaveBeenCalled();
          expect(errorLoggerSpy)
            .toHaveBeenCalledWith(`Something went wrong when attempt to create dictionary: ${error}`);
        });
    });
  });

  fdescribe(("generateFlows()"), () => {
    it("Writes files for every lanugage provided with the correct file name", () => {
      const fileName = "file-name";
      const description = "fake description";
      const flow = getMockFlow();
      const originalDictionary = getOriginalDictionary();

      const prefix = "fake-prefix";

      translationService.languages = ["EN", "ES_US", "FR"];

      translationService.makeDirectory = jasmine.createSpy("makeDirectory").and.returnValue(Promise.resolve({}));
      translationService.writeFile = jasmine.createSpy("writeFile").and.returnValue(Promise.resolve({}));
      translationService.readFile = jasmine.createSpy("readFile").and.returnValues(
        flow,
        originalDictionary,
      );

      const loggerSpy = spyOn(console, "log");

      TwilioFlowTranslation.createNewFlow = jasmine.createSpy("createNewFlow").and.returnValue(Promise.resolve({}));

      // const createNewFlowSpy = spyOn(TwilioFlowTranslation, "createNewFlow");


      return translationService.generateFlows(".", description, prefix, ".")
      .then(() => {
        expect(translationService.makeDirectory).toHaveBeenCalledTimes(1);
        expect(translationService.makeDirectory).toHaveBeenCalledWith(prefix);
        expect(translationService.readFile).toHaveBeenCalledTimes(2);
        expect(TwilioFlowTranslation.createNewFlow).toHaveBeenCalledTimes(translationService.languages.length);
        expect(loggerSpy).toHaveBeenCalledTimes(1);
      })
      .catch((error) => {
        fail(error);
      });
    })

    it("Logs an error if something goes wrong reading files", () => {
      const error = new Error("test error");
      const description = "fake description";
      const prefix = "fake-prefix";

      translationService.languages = ["EN", "ES_US", "FR"];

      translationService.readFile = jasmine.createSpy("readFile").and.returnValues(Promise.reject());
      translationService.makeDirectory = jasmine.createSpy("makeDirectory").and.returnValue(Promise.resolve({}));
      translationService.writeFile = jasmine.createSpy("writeFile").and.returnValue(Promise.resolve({}));

      const errorLoggerSpy = spyOn(console, "error");

      TwilioFlowTranslation.createNewFlow = jasmine.createSpy("createNewFlow").and.returnValue(Promise.resolve());

      return translationService.generateFlows(".", description, prefix, ".")
      .then(() => {
        expect(translationService.makeDirectory).not.toHaveBeenCalledTimes(1);
        expect(translationService.readFile).toHaveBeenCalledTimes(1);
        expect(translationService.writeFile).not.toHaveBeenCalled();

        expect(TwilioFlowTranslation.createNewFlow).not.toHaveBeenCalled();
        expect(errorLoggerSpy).toHaveBeenCalledTimes(1);
      })
      .catch((error) => {
        fail(error);
      });
    })

    it("Logs an error if one or more flow were not able to be generated", () => {
      const flow = getMockFlow();
      const originalDictionary = getOriginalDictionary();

      const error = new Error("test error");
      const description = "fake description";
      const prefix = "fake-prefix";

      translationService.languages = ["EN", "ES_US", "FR"];

      translationService.readFile = jasmine.createSpy("readFile").and.returnValues(
        flow,
        originalDictionary,
      );
      translationService.makeDirectory = jasmine.createSpy("makeDirectory").and.returnValue(Promise.resolve({}));
      translationService.writeFile = jasmine.createSpy("writeFile").and.returnValue(Promise.resolve({}));

      const errorLoggerSpy = spyOn(console, "error");

      TwilioFlowTranslation.createNewFlow = jasmine.createSpy("createNewFlow").and.callFake(() => {
        throw error;
      });

      return translationService.generateFlows(".", description, prefix, ".")
      .then(() => {
        expect(translationService.readFile).toHaveBeenCalledTimes(2);
        expect(translationService.makeDirectory).not.toHaveBeenCalled();
        expect(translationService.writeFile).not.toHaveBeenCalled();

        expect(TwilioFlowTranslation.createNewFlow).toHaveBeenCalled();
        expect(errorLoggerSpy).toHaveBeenCalledTimes(1);
        // TODO assert exact log
        // expect(errorLoggerSpy).toHaveBeenCalledWith();
      })
      .catch((error) => {
        fail(error);
      });
    })

  });

  xdescribe("createNewFlow", () => {
    it("Creates a new flow if all fields are translated", () => {
      const lang = "EN";
      const description = "description test";
      const flow = getMockFlow();
      const originalDictionary = getOriginalDictionary();

      translationService.readFile = jasmine.createSpy("readFile").and.returnValues(
        flow,
        originalDictionary,
      );

      const translatedFlow = TwilioFlowTranslation.createNewFlow(lang, originalDictionary, flow, description)
      expect(translatedFlow).toBeDefined();
      expect(translatedFlow.description).toBe(`${description}, Language: ${lang}`);
      expect(flow.states.length).toEqual(translatedFlow.states.length);
      flow.states.forEach((state, idx) => {
        expect(state).toEqual(translatedFlow.states[idx]);
      });
    });

    it("Throws an error and does not create a new flow if one or more fields is not translated", () => {
      const lang = "EN";
      const description = "description test";
      const flow = getMockFlow();
      const originalDictionary = getOriginalDictionary();
      originalDictionary.q1.dictionary[lang].text = "";

      const expectedError = new Error(`Could not find ${lang} translation for entry 'q1' in dictionary. ` +
        `Please check the dictionary provided for errors listed above and try again.`
      );

      translationService.readFile = jasmine.createSpy("readFile").and.returnValues(
        flow,
        originalDictionary,
      );
      try {
        TwilioFlowTranslation.createNewFlow(lang, originalDictionary, flow, description)
        fail();
      } catch (err) {
        expect(err).toBeDefined();
        expect(err).toEqual(expectedError);
      }
    });
  });

});
