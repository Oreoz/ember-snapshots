import Snapshotable from 'ember-snapshots/mixins/snapshotable';
import DS from 'ember-data';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const { Model, attr, hasMany } = DS;

const Person = Model.extend(Snapshotable, {
  name: attr({ defaultValue: '' }),
  friends: hasMany('person', { async: false, inverse: null }),
});

module('Unit | Mixin | snapshotable nested relationships', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('model:person', Person);
  });

  test('🥇 it does not break nested relationships', function(assert) {
    const store = this.owner.lookup('service:store');

    const anna = store.createRecord('person', { id: 1, name: 'Anna' });
    const beatrice = store.createRecord('person', { id: 2, name: 'Béatrice' });
    const catherine = store.createRecord('person', { id: 3, name: 'Catherine' });

    assert.ok(anna);
    assert.ok(beatrice);
    assert.ok(catherine);

    assert.equal(anna.friends.length, 0);
    assert.equal(beatrice.friends.length, 0);
    assert.equal(catherine.friends.length, 0);

    anna.friends.pushObject(beatrice);
    beatrice.friends.pushObject(catherine);

    assert.equal(anna.friends.length, 1);
    assert.equal(beatrice.friends.length, 1);
    assert.equal(catherine.friends.length, 0);

    assert.ok(anna.friends.includes(beatrice));
    assert.ok(beatrice.friends.includes(catherine));

    anna.snapshot(['friends']);

    anna.friends.clear();

    assert.equal(anna.friends.length, 0);
    assert.equal(beatrice.friends.length, 1);
    assert.equal(catherine.friends.length, 0);

    assert.ok(beatrice.friends.includes(catherine));

    anna.rollbackToSnapshot();

    assert.equal(anna.friends.length, 1);
    assert.equal(beatrice.friends.length, 1);
    assert.equal(catherine.friends.length, 0);

    assert.ok(anna.friends.includes(beatrice));
    assert.ok(beatrice.friends.includes(catherine));
  });

});

