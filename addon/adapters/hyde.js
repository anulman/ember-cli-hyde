import JSONAPIAdapter from 'ember-data/adapters/json-api';
import CachedShoe from 'ember-cached-shoe';

import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import { denodeify } from 'rsvp';

export default JSONAPIAdapter.extend(...[
  CachedShoe
], {
  hyde: service(),

  host: reads('hyde.defaultHost'),
  namespace: reads('hyde.defaultNamespace'),

  findRecord(store, type, id, snapshot) {
    if (this.get('hyde.fastboot.isFastBoot')) {
      const fs = FastBoot.require('fs');
      const readFile = denodeify(fs.readFile);

      let url = this.urlForFindRecord(id, type.modelName, snapshot);

      return readFile(url, 'utf8')
        .then(JSON.parse);
    }

    return this._super(store, type, id, snapshot);
  },

  urlForFindRecord(id/* , modelName, snapshot */) {
    return `${this.urlPrefix()}/${id}.json`;
  }
});
