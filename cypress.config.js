// cypress.config.js
const { defineConfig } = require('cypress');
const fs = require('fs-extra');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://taskwise-sigma.vercel.app',
    specPattern: 'cypress/e2e/**/*.cy.js',
    downloadsFolder: 'cypress/downloads',
    setupNodeEvents(on, config) {
      on('task', {
        deleteFolder(folderPath) {
          // Return a promise that resolves to null when done
          return fs.remove(folderPath).then(() => null);
        },
      });
      return config;
    },
  },
});
