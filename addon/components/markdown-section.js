import Component from '@ember/component';

import layout from '../templates/components/markdown-section';

const MarkdownSection = Component.extend({
  tagName: 'section',
  layout,

  item: null
});

MarkdownSection.reopenClass({
  positionalParams: ['item']
});

export default MarkdownSection;
