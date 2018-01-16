import JSONAPIAdapter from 'ember-data/adapters/json-api';

import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank, isPresent } from '@ember/utils';

import { denodeify, resolve } from 'rsvp';

export default JSONAPIAdapter.extend({
  hyde: service(),

  host: reads('hyde.defaultHost'),
  namespace: reads('hyde.defaultNamespace'),

  findRecord(store, type, id, snapshot) {
    let shoebox = this.get('hyde.fastboot.shoebox');
    let shoeboxStoreName = type.modelName.replace(/\//g, '-');
    let shoeboxStore = shoebox && shoebox.retrieve(shoeboxStoreName);
    let model;

    id = id.replace(/\/$/, ''); // strip trailing `/`
    model = shoeboxStore && shoeboxStore[id];

    if (isPresent(model)) {
      return resolve(model);
    } else if (!this.get('hyde.fastboot.isFastBoot')) {
      return this._super(store, type, id, snapshot);
    } else {
      return readFile(this.urlForFindRecord(id, type.modelName, snapshot))
        .then((json) => {
          if (isPresent(shoebox)) {
            if (isBlank(shoeboxStore)) {
              shoeboxStore = {};
              shoebox.put(shoeboxStoreName, shoeboxStore);
            }

            shoeboxStore[id] = json;
          }

          return json;
        });
    }
  },

  urlForFindRecord(id/* , modelName, snapshot */) {
    return `${this.urlPrefix()}/${id}.json`;
  }
});

function readFile(url) {
  const fs = FastBoot.require('fs');
  const readFile = denodeify(fs.readFile);

  return readFile(url, 'utf8')
    .then(JSON.parse);
}
