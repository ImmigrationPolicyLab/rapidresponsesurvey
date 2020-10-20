exports.handler = function(context, event, callback) {
    context.getTwilioClient().messages.create({
      to: '+[number that will be sent error notification]',
      from: '+[Twilio number - can be same number used for Twilio flows]',
      body: `Error posting results from survey with participant: ${context.number} at ${new Date()}`,
    }).then((msg) => {
      callback(null, msg.sid);
    }).catch((err) => {
        callback(err)
    });
  }