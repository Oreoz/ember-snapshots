import Snapshotable from 'ember-snapshots/mixins/snapshotable';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const Object = EmberObject.extend(Snapshotable, {});

module('Unit | Mixin | snapshotable object', function(hooks) {
  setupTest(hooks);

  test('🤷‍♂️ it does not modify the original object', function(assert) {
    const object = Object.create({});

    assert.equal(object instanceof EmberObject, true);
    assert.equal(object instanceof Object, true);
  });

  test('💆‍♂️ it creates snapshots & diffs as expected via `snapshot()` and `snapshotDiff()`', function(assert) {
    const object = Object.create({ foo: 'string', bar: 1, baz: true });

    object.snapshot(['foo', 'bar', 'baz']);

    assert.deepEqual(object.snapshotDiff(), {
      foo: ['string', 'string'],
      bar: [1, 1],
      baz: [true, true],
    });

    object.setProperties({
      foo: 'strung',
      bar: 2,
      baz: false,
    });

    assert.deepEqual(object.snapshotDiff(), {
      foo: ['string', 'strung'],
      bar: [1, 2],
      baz: [true, false],
    });

    object.rollbackToSnapshot();

    assert.deepEqual(object.snapshotDiff(), {
      foo: ['string', 'string'],
      bar: [1, 1],
      baz: [true, true],
    });
  });

  test('🙋‍♀️ it enables property rollbacks via `rollbackToSnapshot()`', function(assert) {
    const object = Object.create({ foo: 'string', bar: 1, baz: true });

    object.snapshot(['foo', 'bar', 'baz']);

    object.setProperties({
      foo: 'strung',
      bar: 2,
      baz: false,
    });

    object.rollbackToSnapshot();

    assert.deepEqual(object.snapshotDiff(), {
      foo: ['string', 'string'],
      bar: [1, 1],
      baz: [true, true],
    });
  });
});

