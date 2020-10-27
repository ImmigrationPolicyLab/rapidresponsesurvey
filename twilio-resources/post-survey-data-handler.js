// This code in intended to run as a Twilio function during a Twilio Flow execution
const clientEmailKeyName = "client_email";
const sheetIdKeyName = "sheetId";

const {google} = require("googleapis");
const sheets = google.sheets('v4');

// Define the required scopes.
const scopes = ["https://www.googleapis.com/auth/spreadsheets"];

/**
 * Order the event values to line up with Google Sheet header values
 * @param headers The Google Sheet headers
 * @param eventData The function parameters defined in the twilio survey
 * @returns The new values formatted for Google Sheets api to append data
 */
function getEventResourceValues(headers, eventData) {
  const eventValues = headers.map((header) => {
    if (eventData[header]) {
      return eventData[header]; // If the eventData exists for the headers, add to array
    } else {
      return "No Data"; // If the question wasn't answered, return "no data"
    }
  })
  const resource = {
    values: [eventValues],
  };
  return resource;
}

/**
 * Get the headers from the Google Sheet
 * @param accessToken The accessToken needed for the request
 * @param context The function context with private values
 * @returns Promise that resovles with Google Sheets headers
 */
function getHeaders(accessToken, context) {
  // * May Require Update:
  // Range property below must be extended if headers in google sheet extend beyond Z column
  // "sheetId" should reflect the name used to store the sheetId
  const getBody = {
    access_token: accessToken,
    spreadsheetId: context[sheetIdKeyName],
    range: ["A1:Z1"]
  };
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get(getBody)
      .then((result) => {
        resolve(result);
      })
      .catch(() => {
        getWaitTime(3000)
          .then(() => {
            return sheets.spreadsheets.values.get(getBody);
          })
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          })
      })
  })
}

/**
 * Appends the particpants data to the Google Sheet
 * @param accessToken The accessToken needed for the request
 * @param context The context from the function with private values
 * @param event The function event with parameter values to be written to Google Sheet
 * @param headers The headers of the Google Sheet
 * @returns Promise that resolves with the repsonse from the Google API after successful appending data
 */
function postData(accessToken, context, event, headers) {
 // * May Require Update: "sheetId" should reflect the name used to store the sheetId
   const appendBody = {
    access_token: accessToken,
    spreadsheetId: context[sheetIdKeyName],
    range: ["A1"],
    resource: getEventResourceValues(headers, event), // Run a function to pair the event data to the right database field
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS"
  };
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.append(appendBody)
      .then((result) => {
        resolve(result);
      })
      .catch(() => {
        getWaitTime(3500)
          .then(() => {
            return sheets.spreadsheets.values.append(appendBody);
          })
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      })
  })
}

/**
 * Function to be used for retry logic as it applies to api requests.
 * @param {number} base
 * The base amount of time to wait. A random number between 0 and 1 second will be added to create randomized intervals.
 * @returns Promise that resolves after a set amount of time to create wait time before retrying request.
 */
function getWaitTime(base) {
  let rand = Math.random() * 1000; // Add between 0 and 1 seconds
  const interval = base + rand;
  return new Promise((resolve) => {
    setTimeout(() => {
        return resolve()
    }, interval);
  })
}

/**
 * Calls functions to send get and append request to Google Sheets
 * @param accessToken The accessToken needed for the request
 * @param context The context from the function with private values
 * @param event The function event with parameter values to be written to Google Sheet
 * @returns Promise that resolves with the response from Google after successfully posting data
 */
function getAndAppendSheetData(accessToken, context, event) {
  return getHeaders(accessToken, context)
    .then((data) => {
      const headers = data.data.values[0];
      return postData(accessToken, context, event, headers);
    })
    .catch((error) => {
      throw error;
    })
}

exports.handler = function (context, event, callback) {
  console.log("Entered twilio handler", context, event);
  try {
  	// * May Require Update: Update to reflect the accurate project key
    var jwtClient = new google.auth.JWT(
      context[clientEmailName],
      null,
      `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n`,
      scopes
    );

    /* The event stores the function parameters set in Twilio Studio flow when configurating a function trigger
    For example:
        For [key: intro] and [value: {{widgets.intro.inbound.Body}}] set as the function parameter you will have
        the variable event.intro storing the value of the incoming message body ("1", "2", or undefined if unanswered).
    The event object keys (i.e. the "intro" part of event.intro-response) should correspond to the the spread sheet
    table headers so that the response is recorded accurately. For example, if you set the parameters "intro" and "q2",
    your table headers should also include "intro" and "q2"
    * May Require Update: Additional properties can be added to the event object if needed.
    See how the date is added below for an example: **/
    event.date = new Date();
    jwtClient.authorize((error, tokens) => {
      if (error) {
        console.log("Error making request to generate access token:");
        throw new Error("error");
      } else if (tokens.access_token === null) {
        console.log("Provided service account does not have permission to generate access tokens");
        throw new Error("error");
      } else {
        var accessToken = tokens.access_token;
        return getAndAppendSheetData(accessToken, context, event)
          .then(() => {
            // DO NOT UNCOMMENT UNLESS TESTING ERROR HANDLING
            // throw new Error("Forcing error for test");
            callback();
          })
          .catch((error) => {
            callback(error);
          })
      }
    })
  } catch (error) {
    callback(error);
  }
}