import DS from 'ember-data';

const { Model, attr, belongsTo, hasMany } = DS;

export default Model.extend({
  yaml: attr(),

  parent: belongsTo('hyde/collection'),
  tags: hasMany('hyde/collection')
});
