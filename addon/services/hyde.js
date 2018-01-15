import Service from '@ember/service';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { isPresent } from '@ember/utils';

// todo re-enable
// import fetch from 'fetch';
import { Promise, denodeify } from 'rsvp';

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
    let url = [host, namespace, filename]
      .compact()
      .join('/');

    return this.get('fastboot.isFastBoot') ?
      readFile(url) :
      readFetched(url);
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
