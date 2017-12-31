import DS from 'ember-data';

const { Model, belongsTo, hasMany } = DS;

export default Model.extend({
  parent: belongsTo('hyde/collection'),

  items: hasMany('hyde/item', { inverse: 'parent' }),
  collections: hasMany('hyde/collection', { inverse: 'parent' })
});
