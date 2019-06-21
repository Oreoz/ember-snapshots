import Mixin from '@ember/object/mixin';
import DS from 'ember-data';

const { Model } = DS;

export default Mixin.create({

  init() {
    this._super(...arguments);
    this.set('_snapshot', {});
  },

  rollbackToSnapshot() {
    const snapshot = this.snapshotDiff();

    Object.entries(snapshot).forEach(([ key, [ oldValue ] ]) => {
      this.set(key, oldValue);
    });
  },

  snapshot(props = []) {
    const object = this.getProperties(props);

    if (this instanceof Model) {
      this.eachRelationship((name, descriptor) => {
        if (descriptor.kind === 'hasMany' && props.includes(name)) {
          object[name] = this.get(name).toArray();
        }
      });
    }

    this.set('_snapshot', object);

    return object;
  },

  snapshotDiff() {
    const snapshot = this.get('_snapshot');

    return Object.entries(snapshot).reduce((accumulator, [ key, value ]) => {
      accumulator[key] = [value, this.get(key)];
      return accumulator;
    }, {});
  },

});
