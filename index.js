/* eslint-env node */
'use strict';

const path = require('path');
const mergeTrees = require('broccoli-merge-trees');

const Funnel = require('broccoli-funnel');
const BroccoliHydeCompiler = require('broccoli-hyde-compiler').default;

module.exports = {
  name: 'ember-cli-hyde',

  config(env, baseConfig) {
    this._directoryNames = readHydeDirectoryNames(baseConfig);

    return {
      hyde: {
        namespace: ''
      }
    }
  },

  treeForPublic(tree) {
    let hydeTrees = this._directoryNames.map((name) => {
      let content = new Funnel(path.join(this.project.root, name), {
        include: ['**/*'],
        annotation: 'uncompiled Hyde files'
      });

      return new BroccoliHydeCompiler(content, {
        name,
        include: ['**/*'],
        annotation: 'compiled Hyde files'
      });
    });

    return tree === undefined ?
      mergeTrees(hydeTrees) :
      mergeTrees(hydeTrees.concat(tree));
  }
}

function readHydeDirectoryNames(config) {
  if (config.hyde === undefined) {
    return ['content'];
  } else if (config.hyde.directories !== undefined) {
    return config.hyde.directories instanceof Array ?
      config.hyde.directories :
      [config.hyde.directories];
  } else {
    return typeof config.hyde.directory === 'string' ?
      [config.hyde.directory] :
      ['content'];
  }
}
