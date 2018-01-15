import Service from '@ember/service';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { isBlank, isPresent } from '@ember/utils';

import fetch from 'fetch';
import { Promise, denodeify, resolve } from 'rsvp';

const SHOEBOX_STORE_NAME = 'hyde-files';

export default Service.extend({
  fastboot: computed(function() {
    return getOwner(this).lookup('service:fastboot');
  }),

  defaultHost: fastbootRoot,
  defaultNamespace: 'hyde',

  fetchFile(filename, {
    host = this.get('defaultHost'),
    namespace = this.get('defaultNamespace')
  } = {}) {
    let shoebox = this.get('fastboot.shoebox');
    let shoeboxStore = shoebox && shoebox.retrieve(SHOEBOX_STORE_NAME);
    let file = shoeboxStore && shoeboxStore[filename];

    if (isPresent(file)) {
      return resolve(file);
    } else {
      let url = [host, namespace, filename]
        .compact()
        .map((value) => value.endsWith('/') ? value.slice(0, -1) : value)
        .join('/');

      if (!this.get('fastboot.isFastBoot')) {
        return readFetched(url);
      }

      return readFile(url).then((content) => {
        if (isPresent(shoebox)) {
          if (isBlank(shoeboxStore)) {
            shoeboxStore = {};
            shoebox.put(SHOEBOX_STORE_NAME, shoeboxStore);
          }

          shoeboxStore[filename] = content;
        }

        return content;
      });
    }
  }
});

export function fastbootRoot() {
  return this.get('fastboot.request.headers.headers.x-broccoli.outputPath');
}

function readFile(url) {
  const fs = FastBoot.require('fs');
  const readFile = isPresent(fs) && denodeify(fs.readFile);

  return readFile(url, 'utf8');
}

function readFetched(url) {
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onloadend = function didReadMarkdown() {
        if (isPresent(reader.error)) {
          reject(reader.error);
        } else {
          resolve(reader.result);
        }
      }

      reader.readAsText(blob);
    }));
}
