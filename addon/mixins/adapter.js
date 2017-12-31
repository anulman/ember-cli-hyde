import Ember from 'ember';

const { Mixin } = Ember;

export default Mixin.create({
  urlForFindRecord(id/* , modelName, snapshot */) {
    return `${this.urlPrefix()}hyde/${id}.json`;
  }
});
