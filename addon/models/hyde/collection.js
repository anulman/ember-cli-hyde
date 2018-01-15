import DS from 'ember-data';
import { all } from 'rsvp';

const { Model, attr, belongsTo, hasMany } = DS;

export default Model.extend({
  name: attr('string'),

  parent: belongsTo('hyde/collection'),

  items: hasMany('hyde/item', { inverse: 'parent' }),
  collections: hasMany('hyde/collection', { inverse: 'parent' })
});

export function fetchContents(collection) {
  return collection.get('collections')
    .then((collections) => {
      return all(collections.reduce((records, collection) => records
        .concat(collection.get('items'))
        .concat(collection.get('collections')), []));
    });
}
