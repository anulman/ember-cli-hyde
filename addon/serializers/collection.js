import DS from 'ember-data';
import { isBlank } from '@ember/utils';

const { JSONAPISerializer } = DS;

export default JSONAPISerializer.extend({
  normalize(typeClass, hash) {
    let json = this._super(typeClass, hash);

    if (isBlank(json.data.attributes.name)) {
      json.data.attributes.name = json.data.id
        .slice(json.data.id.lastIndexOf('/') + 1)
        .split('-')
        .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
        .join(' ');
    }

    return json;
  }
});
