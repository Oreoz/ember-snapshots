Ember Snapshots
==============================================================================

A simple addon to manage changes in Ember Objects and Ember Data Models.


Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-snapshots
```


Usage
------------------------------------------------------------------------------

- `snapshot(props)`

```js
const parent = store.createRecord('parent', { id: 1, name: 'Noah' });
const child = store.createRecord('child', { id: 1 });

parent.snapshot(['child']);
```

- `snapshotDiff()`

```js
const parent = store.createRecord('parent', { id: 1, name: 'Noah' });
const child = store.createRecord('child', { id: 1 });

parent.snapshot(['child']);

parent.set('child', child);

/**
 * oldValue: null
 * newValue.id: 1
 */
const { child: [ oldValue, newValue ] } = parent.snapshotDiff();
```

- `rollbackToSnapshot()`

```js
const parent = store.createRecord('parent', { id: 1, name: 'Noah' });
const child = store.createRecord('child', { id: 1 });

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
