const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://reqres.in/api',
    screenshotOnRunFailure: false,
    video: true
  },
});
