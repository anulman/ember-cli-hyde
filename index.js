'use strict';

const path = require('path');
const mergeTrees = require('broccoli-merge-trees');

const Funnel = require('broccoli-funnel');
const BroccoliHydeCompiler = require('broccoli-hyde-compiler').default;

const hydeConfig = require('./lib/config');
module.exports = {
  name: 'ember-cli-hyde',

  hydeConfig,

  treeForPublic(tree) {
    this.hydeTrees = this.hydeConfig().directories.map((name) => {
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
      mergeTrees(this.hydeTrees) :
      mergeTrees(this.hydeTrees.concat(tree));
  }
};
