[*Up*](./README.md)

# Single key existence

If you need to check whether a single key exists in an object, map, or set, that's what these methods are used for.

## Object property keys

```js
// Via `assert.matchLoose`
assert.hasIn(object, key)
assert.lacksIn(object, key)

// Via `assert.matchStrict`
assert.deeplyHasIn(object, key)
assert.deeplyLacksIn(object, key)

// Via SameValueZero
assert.exactlyHasIn(object, key)
assert.exactlyLacksIn(object, key)
```

Assert that an object has (or lacks) a key, either own or inherited. It's pretty basic.

## Own property keys

```js
// Via `assert.matchLoose`
assert.hasOwn(object, key)
assert.lacksOwn(object, key)

// Via `assert.matchStrict`
assert.deeplyHasOwn(object, key)
assert.deeplyLacksOwn(object, key)

// Via SameValueZero
assert.exactlyHasOwn(object, key)
assert.exactlyLacksOwn(object, key)
```

Assert that an object has (or lacks) a key, either own or inherited. It's primarily useful for testing more arcane details with things like polyfills or proxies.

## Map/Set keys

```js
// Via `assert.matchLoose`
assert.hasKey(map, key)
assert.lacksKey(map, key)

// Via `assert.matchStrict`
assert.deeplyHasKey(map, key)
assert.deeplyLacksKey(map, key)

// Via SameValueZero
assert.exactlyHasKey(map, key)
assert.exactlyLacksKey(map, key)
```

Assert that a map or set has (or lacks) a key. Anything resembling a map or set works, including a [normal map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), a [weak set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet), or even an [ImmutableJS list](https://facebook.github.io/immutable-js/docs/#/List). It just needs a `has` method which accepts the given key.
