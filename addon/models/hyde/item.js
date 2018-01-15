import DS from 'ember-data';
import ObjectProxy from '@ember/object/proxy'
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin'
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);
const { Model, attr, belongsTo, hasMany } = DS;

export default Model.extend({
  hyde: service(),

  yaml: attr(),

  parent: belongsTo('hyde/collection'),
  tags: hasMany('hyde/collection'),

  markdown: computed('id', function() {
    let promise = this.get('hyde').fetchFile(`${this.get('id')}.md`);

    return ObjectPromiseProxy.create({ promise });
  })
});
