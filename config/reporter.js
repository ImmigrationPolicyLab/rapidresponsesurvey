var Jasmine = require('jasmine');
var jasmine = new Jasmine();
const SpecReporter = require("jasmine-spec-reporter").SpecReporter;

jasmine.loadConfigFile('spec/support/jasmine.json');
const reporter = new SpecReporter({
  spec: {
    displaySuccessful: true,
    displayFailed: true,
    displayPending: true,
    displayErrorMessages: true,
    displayStacktrace: false,
    displayDuration: true
  },
})

jasmine.addReporter(reporter);
jasmine.execute();
