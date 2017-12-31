import DS from 'ember-data';

const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend({
  urlForFindRecord(id/* , modelName, snapshot */) {
    return `/hyde/${id}.json`;
  }
});
