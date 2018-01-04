import Ember from 'ember';
import fetch from 'fetch';

import layout from '../templates/components/markdown-section';

const {
  Component,
  ObjectProxy,
  PromiseProxyMixin,
  RSVP: { Promise },
  computed,
  isPresent
} = Ember;

const MarkdownSection = Component.extend({
  tagName: 'section',
  layout,

  item: null,
  urlPrefix: '/hyde',

  markdown: computed('item.id', function() {
    let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

    return ObjectPromiseProxy.create({
      promise: fetch(`${this.get('urlPrefix')}/${this.get('item.id')}.md`)
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
        }))
		});
  })
});

MarkdownSection.reopenClass({
  positionalParams: ['item']
});

export default MarkdownSection;
