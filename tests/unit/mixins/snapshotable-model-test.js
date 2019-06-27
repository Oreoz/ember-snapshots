import Snapshotable from 'ember-snapshots/mixins/snapshotable';
import DS from 'ember-data';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const { Model, attr, belongsTo, hasMany } = DS;

const Parent = Model.extend(Snapshotable, {
  name: attr({ defaultValue: '' }),
  child: belongsTo({ async: false }),
  children: hasMany({ async: false }),
});

const Child = Model.extend({
  name: attr({ defaultValue: '' }),
});

module('Unit | Mixin | snapshotable model', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('model:parent', Parent);
    this.owner.register('model:child', Child);
  });

  test('🤴 it is possible to snapshot values and then get the difference', function(assert) {
    const store = this.owner.lookup('service:store');

    const parent = store.createRecord('parent', { id: 1, name: 'Noah' });
    const child = store.createRecord('child', { id: 1 });

    parent.snapshot(['child']);

    assert.deepEqual(parent.snapshotDiff(), { child: [null, null] });

    parent.set('child', child);

    const { child: [oldValue, newValue] } = parent.snapshotDiff();

    assert.equal(oldValue, null);
    assert.equal(newValue.id, 1);
    assert.equal(newValue instanceof DS.Model, true);
  });

  test('👸 it is possible to rollback to the snapshot', function (assert) {
    const store = this.owner.lookup('service:store');

    const parent = store.createRecord('parent', { id: 1, name: 'Noah' });
    const child = store.createRecord('child', { id: 1 });

    assert.equal(parent.child, null);

    parent.snapshot(['child']);

    assert.deepEqual(parent.snapshotDiff(), { child: [null, null] });

    parent.set('child', child);

    assert.equal(parent.child.id, 1);

    parent.rollbackToSnapshot();

    assert.equal(parent.child, null);
  });

  test('🧚‍♂️ it returns an empty object when no snapshot was taken', function(assert) {
    const store = this.owner.lookup('service:store');

    const parent = store.createRecord('parent', { id: 1, name: 'Noah' });

    assert.deepEqual(parent.snapshotDiff(), {});
  });

  test('🕺 it returns an empty snapshot and diff when snapshotting no properties', function(assert) {
    const store = this.owner.lookup('service:store');

    const parent = store.createRecord('parent', { id: 1, name: 'Noah' });

    assert.deepEqual(parent.snapshot(), {});
    assert.deepEqual(parent.snapshotDiff(), {});
  });

  test('🧜‍♂️ it does not affect the model when rolling back to an empty snapshot', function(assert) {
    const store = this.owner.lookup('service:store');

    const parent = store.createRecord('parent', { id: 1, name: 'Noah' });

    parent.rollbackToSnapshot();

    assert.deepEqual(parent.id, '1');
    assert.deepEqual(parent.name, 'Noah');
  });

  test('🧝‍♀️ it reverts `hasMany` relationships correctly', function(assert) {
    const store = this.owner.lookup('service:store');

    const child1 = store.createRecord('child');
    const child2 = store.createRecord('child');
    const parent = store.createRecord('parent', { id: 1, name: 'Noah', children: [child1, child2] });

    parent.snapshot(['children']);

    assert.equal(parent.children.length, 2);

    parent.set('children', []);

    assert.equal(parent.children.length, 0);

    parent.rollbackToSnapshot();

    assert.equal(parent.children.length, 2);
  });
});

