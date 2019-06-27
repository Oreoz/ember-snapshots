Ember Snapshots
==============================================================================

A simple addon to manage changes in Ember Objects and Ember Data Models.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.0 or above
* Ember CLI v3.0 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-snapshots
```


Usage
------------------------------------------------------------------------------

- `snapshot(props)`

Creates a snapshot with the passed-in properties.

```js
const parent = store.createRecord('parent', { name: 'Noah' });
const child = store.createRecord('child');

parent.snapshot(['child']);
```

- `snapshotDiff()`

Returns the difference between the object's current state and the latest snapshot.

```js
const parent = store.createRecord('parent', { name: 'Noah' });
const child = store.createRecord('child');

parent.snapshot(['child']);

parent.set('child', child);

/**
 * oldValue: null
 * newValue.id: 1
 */
const { child: [ oldValue, newValue ] } = parent.snapshotDiff();
```

- `rollbackToSnapshot()`

Rollsback the object to the latest snapshot.

```js
const parent = store.createRecord('parent', { name: 'Noah' });
const child = store.createRecord('child');

parent.get('child'); // returns null

parent.snapshot(['child']);

parent.set('child', child);
parent.get('child'); // returns child

parent.rollbackToSnapshot();
parent.get('child'); // returns null
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
