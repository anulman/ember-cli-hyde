import MarkdownSection from 'ember-cli-hyde/components/markdown-section';
import ENV from '../config/environment';

export default MarkdownSection.extend({
  urlPrefix: `${ENV.hyde.namespace}/hyde`
});
