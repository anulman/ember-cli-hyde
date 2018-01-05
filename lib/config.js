'use strict';

const assert = require('assert');

const DEFAULT_CONFIG = {
  directory: 'content',
  prember: {
    prefix: null, // computed at runtime based on root collection's name
    itemPrefix: null,
    collectionPrefix: 'collections/'
  }
};

// h/t @ef4 + prember for the pattern
module.exports = function() {
  if (!this._hydeConfig) {
    this._hydeConfig = loadConfig(this);
  }

  return this._hydeConfig;
};

function loadConfig(context) {
  let app = findHost(context);
  let config = app.options.hyde || {};

  config.directories = loadDirectories(config);
  config.prember = loadPremberUrlBuilders(config);

  return config;
}

function findHost(context) {
  var current = context;
  var app;

  // Keep iterating upward until we don't have a grandparent.
  // Has to do this grandparent check because at some point we hit the project.
  do {
    app = current.app || app;
  } while (current.parent && current.parent.parent && (current = current.parent));

  return app;
}

function loadDirectories(config) {
  if (config.directories !== undefined) {
    return config.directories instanceof Array ?
      config.directories :
      [config.directories];
  } else {
    return typeof config.directory === 'string' ?
      [config.directory] :
      ['content'];
  }
}

function loadPremberUrlBuilders(config) {
  let prember = config.prember;

  if (prember == null || prember === true) {
    prember = config.directories;
  }

  return prember instanceof Array ?
    prember.map(loadPremberUrlBuilder) :
    prember !== false && [loadPremberUrlBuilder(prember)];
}

function loadPremberUrlBuilder(builder) {
  if (typeof builder === 'string') {
    builder = { name: builder, collectionPrefix: true };
  }

  assert.ok(builder.name);

  for (let configKey in DEFAULT_CONFIG.prember) {
    let configValue = builder[configKey];

    if (configValue === true) {
      builder[configKey] = DEFAULT_CONFIG.prember[configKey] ||
        `${builder.name}/`; // computes default root collection name at runtime
    } else if (configValue == null) {
      builder[configKey] = '';
    } else {
      assert.ok(typeof configValue === 'string');
      builder[configKey] = configValue;
    }
  }

  return builder;
}
