import Component from '@ember/component';
import ObjectProxy from '@ember/object/proxy'
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin'

import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

import layout from '../templates/components/markdown-section';

const ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

const MarkdownSection = Component.extend({
  hyde: service(),

  tagName: 'section',
  layout,

  item: null,
  shouldCache: false,

  init() {
    this._super(...arguments);

    if (this.get('hyde.fastboot.isFastBoot')) {
      this.get('hyde.fastboot').deferRendering(this.get('markdown'));
    }
  },

  willDestroy() {
    if (this.get('shouldCache') === false) {
      this.set('item', null);
    }
  },

  markdown: computed('item.id', function() {
    let promise = this.get('hyde').fetchFile(`${this.get('item.id')}.md`);

    return ObjectPromiseProxy.create({ promise });
  })
});

MarkdownSection.reopenClass({
  positionalParams: ['item']
});

export default MarkdownSection;
