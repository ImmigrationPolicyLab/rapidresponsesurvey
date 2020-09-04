const { handler, context } = require("./batch-test.js");

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
        // console.log("number", i);
        event.q1 = `${i}`;
        promArr.push(handler(context, { ...event }, null));
    }
    try {
        return Promise.all(promArr);
    } catch (error) {
        console.log("error from promise all", error);
    }
}

testBatch(1);