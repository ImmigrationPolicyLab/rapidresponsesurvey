# Rapid Response Survey

This repository supports generating translation dictionaries from Twilio flows, and creating Twilio flow translations given a completed dictionary with translations for all messages and a source Twilio Flow. Flow  translation dictionaries must be populated manually at first but can be easily updated with code in this repository if new questions are added to the source Twilio Flow.

### Create a new Twilio Flow dictionary from a Twilio Flow:
In your terminal, from the root folder, RAPIDRESPONSESURVEY run the following command:

`sh shell/create-new-dictionary.sh [path-to-source-flow]`

This will run a bash script that does the following:
* Prompts you to provide a title. Separate words with dashes in between (no spaces) if using more than one word.
* Prompts you to provide a filename. Separate characters with dashes or underscores in between (no spaces).
* Prompts you to provide a list of languages. Enter languages as a list separated by commas, no spaces (i.e. “EN,FR,ES).

Check for your new dictionary (to be filled in) in the ./outputs/dictionaries folder.

If offering survey participants multiple choice questions, separate the options with a `\n` (a line break). This is generate dictionary fields for each response choice and help ensure that all fields are property translated.

For example, consider the following widget for question 2 in an example survey:
```
        {
            "name": "q2",
            "type": "send-and-wait-for-reply",
            "transitions": [
                {
                    "next": "q2_split",
                    "event": "incomingMessage"
                },
                {
                    "next": "postresponses_noreply",
                    "event": "timeout"
                },
                {
                    "event": "deliveryFailure"
                }
            ],
            "properties": {
                "offset": {
                    "x": 90,
                    "y": 1680
                },
                "service": "{{trigger.message.InstanceSid}}",
                "channel": "{{trigger.message.ChannelSid}}",
                "from": "{{flow.channel.address}}",
                "body": "In the past four weeks, how many hours did you usually work each week? Please respond with the number of your response.\n1. 0\n2. 1-10\n3. 11-20\n4. 21-35\n5. 36 or more",
                "timeout": 172800
            }
        },
```

This will produce new entry in the dictionary with the following fields that need to be translated. If any fields are left blank, an attempt to create the translated flow for the language will fail. The source language (English) text will automatically be mapped in the new dictionary.
```
      "EN": {
        "text": "In the past four weeks, how many hours did you usually work each week? Please respond with the number of your response.",
        "option-1": "1. 0",
        "option-2": "2. 1-10",
        "option-3": "3. 11-20",
        "option-4": "4. 21-35",
        "option-5": "5. 36 or more"
      },
      "ES-US": {
        "text": "",
        "option-1": "",
        "option-2": "",
        "option-3": "",
        "option-4": "",
        "option-5": "",
      },
```

### Add translations to Twilio Flow Dictionary:
Once you have translations for the questions for the survey, make sure to fill out all fields of your new dictionary with the appropriate translation for each question in order to get a complete flow when translated. A validation logic will remind you later on if you are missing any translations as well.

The following is an example of a survey question with multiple choice answered translated for English and Spanish:

```
      "EN": {
        "text": "In the past four weeks, how many hours did you usually work each week? Please respond with the number of your response.",
        "option-1": "1. 0",
        "option-2": "2. 1-10",
        "option-3": "3. 11-20",
        "option-4": "4. 21-35",
        "option-5": "5. 36 or more"
      },
      "ES-US": {
        "text": "En las últimas cuatro semanas, ¿cuántas horas trabajó habitualmente cada semana? Responda con el número de la respuesta.",
        "option-1": "1. 0",
        "option-2": "2. De 1 a 10",
        "option-3": "3. De 11 a 20",
        "option-4": "4. De 21 a 35",
        "option-5": "5. 36 o más"
      },
```

### Generate Twilio flow translations with a complete Twilio Flow Dictionary and Twilio Flow (source flow):
In your terminal, from the root folder, RAPIDRESPONSESURVEY run the following command:

`sh shell/create-new-translations.sh [path-to-source-flow] [path-to-source-dictionary]`
This will run a bash script that does the following:
* Prompts you to provide a file prefix. Separate words and characters with dashes or underscores in between (no spaces).
* Prompts you to provide a description. Separate characters with dashes or underscores in between (no spaces).

Check for your new flows in the folder ./outputs/flows . Upload these flows as a JSON flow in Twilio Studio as needed.

### Updating a Twilio Flow Dictionary with new question fields:
In your terminal, from the root folder, RAPIDRESPONSESURVEY run the following command:

`sh shell/create-updated-dictionary.sh [path-to-source-flow] [path-to-source-dictionary]`

Note in this case, the source flow is the updated source flow with new question fields, and the source dictionary is the pre-existing dictionary generated from a create-new-dictionary command.

This will run a bash script that does the following:
* Prompts you to enter a title. Separate words and characters with dashes in between (no spaces).
* Prompts you to enter a filename. Separate words and characters with dashes in between (no spaces).
* If there are no new entries found (i.e. there are no new questions added to the source flow), no new dictionary will be created. If there are new entries found, a new dictionary will be created with existing question fields filled out and new question fields blank. Check logs for additional details about the success of creating the new dictionary.

### Upload your Twilio flow translations to Twilio:
Refer to the section 4.2 in the documentation linked [here](https://docs.google.com/document/d/18Paj9S_m51L5W8HlcYM5y0XRe1BPSWeYBs0KUabXvaM/edit#heading=h.hkxewghi8o8g) for details on how to create a Twilio Flow on Twilio Studio with the json output.

### Mimic API calls to test throttling:
Example:
* Create a file named.env at the root level (your project )
* Enter in you google credentials into the .env file as:
```
CLIENT_EMAIL=twiliotest@tet.gserviceaccount.com
PRIVATE_KEY=xxx
```
* Update the number of calls in the mock-twilio-handler-events.js file.
* Run node mock-twilio-handler-events.js in terminal.