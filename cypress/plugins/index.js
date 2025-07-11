/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import coverage from '@cypress/code-coverage/task.js';
import useBabelRc from '@cypress/code-coverage/use-babelrc.js';

/**
 * @type {Cypress.PluginConfig}
 */
const plugins = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  coverage(on, config);
  on('file:preprocessor', useBabelRc); // For unit testing

  return config;
};

export default plugins;
