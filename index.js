'use strict';

const path = require('path');

const Funnel = require('broccoli-funnel');
const BroccoliMergeTrees = require('broccoli-merge-trees');
const { default: BroccoliHydeCompiler } = require('broccoli-hyde-compiler');

const hydeConfig = require('./lib/config');
const urlsForPrember = require('./lib/prember');

module.exports = {
  name: 'ember-cli-hyde',

  hydeConfig,
  urlsForPrember,

  init() {
    this._super.init && this._super.init.apply(this, arguments);
    this.hydes = [];
  },

  treeForTemplates(tree) {
    let { directories, include, exclude } = this.hydeConfig();

    let trees = directories.map((name) => {
      return new Funnel(path.join(this.project.root, name), {
        include,
        exclude,
        destDir: `hyde/${name}`
      });
    });

    return tree === undefined ?
      new BroccoliMergeTrees(trees) :
      new BroccoliMergeTrees(trees.concat(tree));
  },

  preprocessTree(type, tree) {
    // hypothesis: mbs files are being excluded from the template tree
    switch (type) {
      case 'template':
        let { directories } = this.hydeConfig();
        let templateIncludes = ['**/*.mbs', '**/*.hbs'];
        let { templates, all } = directories
          .reduce(({ templates, all }, name) => {
            let hydeTree = new Funnel(tree, {
              include: [`**/hyde/${name}/**/*`],
            });

            let compiledHyde = new BroccoliHydeCompiler(hydeTree, { name });

            this.hydes.push(compiledHyde.hyde);

            templates.push(new Funnel(compiledHyde, {
              include: templateIncludes,
              destDir: `hyde/${name}`
            }));

            all.push(new Funnel(compiledHyde, {
              exclude: templateIncludes,
              destDir: `hyde/${name}`
            }));

            return { templates, all };
          }, { templates: [], all: [] });

        this.hydePublicTrees = all;

        return new BroccoliMergeTrees([tree, ...templates]);
      default: return tree;
    }
  },

  postprocessTree(type, tree) {
    let { directories } = this.hydeConfig();

    switch (type) {
      case 'template':
        this.hydeTemplateTrees = directories.map((name) => {
          return new Funnel(tree, {
            include: [`hyde/${name}/**/*`]
          });
        });

        return new Funnel(tree, {
          exclude: ['**/hyde/**/*']
        });
      case 'all':
        return new BroccoliMergeTrees([
          tree,
          ...this.hydePublicTrees,
          ...this.hydeTemplateTrees
        ]);
      default: return tree;
    }
  }
};
