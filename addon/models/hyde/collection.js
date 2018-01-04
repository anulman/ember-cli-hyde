import DS from 'ember-data';

const { Model, attr, belongsTo, hasMany } = DS;

export default Model.extend({
  name: attr('string'),

  parent: belongsTo('hyde/collection'),

  items: hasMany('hyde/item', { inverse: 'parent' }),
  collections: hasMany('hyde/collection', { inverse: 'parent' })
});
