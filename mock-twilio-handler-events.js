const { handler, context } = require("./mock-twilio-handler.js");

console.log("test");

// Send batch requests to Google Sheet
const testBatch = (n) => {
    const event = {
        q1: "my answer to q1",
        q2: "my answer to q2",
        q4: "my answer to q4",
        q5: "my answer to q5",
    };

    const promArr = [];
    // Create n requests to write to the Google Sheet
    for (let i = 0; i < n; i++) {
        event.q1 = `${i}`;
        promArr.push(handler(context, { ...event }, null));
    }
    try {
        return Promise.all(promArr);
    } catch (error) {
        console.log("error from promise all", error);
    }
}

// Update the number of request to google sheets here
// You will likely see errors at more than 50 requests, since all initial requests are fired together
const numberOfRequests = 100;
testBatch(numberOfRequests);