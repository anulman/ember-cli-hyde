const Blueprint = require('ember-cli/lib/models/blueprint');

module.exports = class HydeBlueprint extends Blueprint {
  constructor(options) {
    super(options);

    this.description = 'Install hyde in the project.';
  }

  normalizeEntityName(entityName) {
    return entityName;
  },

  afterInstall() {
    return this.addPackagesToProject([
      { name: 'ember-fetch' } // fastboot needs this in the consuming project
    ]);
  }
}
