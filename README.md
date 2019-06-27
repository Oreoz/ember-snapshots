Ember Snapshots 📸
==============================================================================

[![Build Status](https://travis-ci.org/Oreoz/ember-snapshots.svg?branch=master)](https://travis-ci.org/Oreoz/ember-snapshots)
[![Maintainability](https://api.codeclimate.com/v1/badges/20902e84089f70f5303b/maintainability)](https://codeclimate.com/github/Oreoz/ember-snapshots/maintainability)

A simple addon to manage changes in Ember Objects and Ember Data Models.

Installation
------------------------------------------------------------------------------

```
ember install ember-snapshots
```


Usage
------------------------------------------------------------------------------

First step is to consume the mixin in the entities you want to snapshot.

```js
import Snapshotable from 'ember-snapshots/mixins/snapshotable';
import EmberObject from '@ember/object';
import DS from 'ember-data';

// You can use the mixin with `ember-data` models. 👍
const Parent = DS.Model.extend(Snapshotable, {});

// You can also use it with Ember objects. 👌
const Object = EmberObject.extend(Snapshotable, {});
```

Once your object or model consumes the mixin, you'll have acces to the following methods:

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

Compatibility
------------------------------------------------------------------------------

* Ember.js v3.0 or above
* Ember CLI v3.0 or above
* Node.js v8 or above

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
