const dotenv = require('dotenv');
dotenv.config();
const process = require("process");

const { google } = require('googleapis');
const sheets = google.sheets('v4');

const sheetId = "14vtJOe3FDPnI94Eo2sqElLhovLn3fO5jkHcCJ14g0cQ";
const c_email = process.env.CLIENT_EMAIL;
const key = process.env.PRIVATE_KEY.replace(/\\n/gm, "\n")
const private_key = `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----\n`;

// Common problem with library: https://github.com/nodejs/node-gyp/issues/695
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Define the required scopes.
var scopes = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.compose"
];

var jwtClient = new google.auth.JWT(
  c_email,
  null,
  private_key,
  scopes
);

const context = {
  sheetId,
  c_email
};


/**
 * Order the event values to line up with Google Sheet header values
 * @param {*} headers The Google Sheet headers
 * @param {*} eventData The function parameters defined in the twilio survey
 * @returns The new values formatted for Google Sheets api to append data
 */
function getEventResourceValues(headers, eventData) {
  const eventValues = headers.map((header) => {
    if (eventData[header]) {
      return eventData[header]; // if the eventData exists for the headers, add to array
    } else {
      return "No Data"; // If the question wasn't answered, return no data
    }
  })
  const resource = {
    values: [eventValues],
  };
  return resource;
}

/**
 * getHeaders Get the headers from the Google Sheet
 * @param {*} accessToken The accessToken needed for the request
 * @param {*} context The function context with private values
 * @returns Promise that resovles with Google Sheets headers
 */
function getHeaders(accessToken, context) {
  const getBody = {
    access_token: accessToken,
    spreadsheetId: context.sheetId,
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
            console.log("got headers on retry");
            resolve(result);
          })
          .catch((error) => {
            console.error("could not fetch headers on retry: ", error && error.response && error.response.data.error.message);
            reject(error);
          })
      })
  })
}

/**
 * postData Appends the particpants data to the Google Sheet
 * @param {*} accessToken The accessToken needed for the request
 * @param {*} context The context from the function with private values
 * @param {*} event The function event with parameter values to be written to Google Sheet
 * @param {*} headers The headers of the Google Sheet
 * @returns Promise that resolves with the repsonse from the Google API after successful appending data
 */
function postData(accessToken, context, event, headers) {
  const appendBody = {
    access_token: accessToken,
    spreadsheetId: context.sheetId,
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
      .catch((error) => {
        getWaitTime(4000)
          .then(() => {
            return sheets.spreadsheets.values.append(appendBody);
          })
          .then((result) => {
            console.log("wrote data on retry");
            resolve(result);
          })
          .catch((error) => {
            console.error("could not write data on retry: ", error && error.response && error.response.data.error.message);
            reject(error);
          });
      })
  })
}

/**
 * getWaitTime Wait a set amount of time
 * @param {*} base The base amount of time to wait, onto which a random number between 0 and 1 second will be added
 * @returns A promise that resolves after a set amount of time to create wait time before retrying request to Google in case of error
 */
function getWaitTime(base) {
  let rand = Math.random() * 1000; // Add between 0 and 1.5 seconds
  const interval = base + rand;
  return new Promise((resolve) => {

    setTimeout(() => {
      resolve();
    }, interval)
  })
}

/**
 * getAndAppendSheetData calls functions to send get and append request to Google Sheets
 * @param {*} accessToken The accessToken needed for the request
 * @param {*} context The context from the function with private values
 * @param {*} event The function event with parameter values to be written to Google Sheet
 * @returns Promise that resolves with the response from Google after successfully posting data
 */
function getAndAppendSheetData(accessToken, context, event) {
  return getHeaders(accessToken, context)
    .then((data) => {
      const headers = data.data.values[0];
      return postData(accessToken, context, event, headers);
    })
    .catch((error) => {
      throw error
    })
}

function handler(context, event) {
  try {
    var jwtClient = new google.auth.JWT(
      c_email,
      null,
      `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----\n`,
      scopes
    );

    event.date = new Date();
    jwtClient.authorize((error, tokens) => {
      if (error) {
        console.log("Error making request to generate access token:", error);
        throw new Error("error");
      } else if (tokens.access_token === null) {
        console.log("Provided service account does not have permission to generate access tokens");
        throw new Error("error");
      } else {
        var accessToken = tokens.access_token;
        return getAndAppendSheetData(accessToken, context, event)
          .then((result) => {
            console.log("Success");
            // callback(null, null);
          })
          .catch((error) => {
            console.error("Attempt did not succeed :(", error);
            throw error;
          })
      }
    })
  } catch (error) {
    console.log("recieved error when trying to get token", error);
    // callback(null, error);
  }
}

module.export = { handler, context };
