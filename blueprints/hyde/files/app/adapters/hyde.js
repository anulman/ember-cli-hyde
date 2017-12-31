import DS from 'ember-data';
import HydeAdapterMixin from 'ember-cli-hyde/mixins/adapter';
import ENV from '../config/environment';

const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend(HydeAdapterMixin, {
  namespace: ENV.hyde.namespace
});
