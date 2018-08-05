[*Up*](./README.md)

# Multiple keys' existence

If you need to check whether all of a number of keys exist within an object, these are the assertions you're looking for.

Note that in each of these, the list of keys doesn't have to be an array - it can be any collection, including array-likes like `arguments` objects and generic iterables of keys like sets.

## Object property keys

```js
// Via `assert.matchLoose`
assert.hasAllIn(object, [...keys])
assert.lacksAllIn(object, [...keys])

// Via `assert.matchStrict`
assert.deeplyHasAllIn(object, [...keys])
assert.deeplyLacksAllIn(object, [...keys])

// Via SameValueZero
assert.exactlyHasAllIn(object, [...keys])
assert.exactlyLacksAllIn(object, [...keys])
```

Assert that an object has (or lacks) zero or more keys, either own or inherited. It's pretty basic.

## Own property keys

```js
// Via `assert.matchLoose`
assert.hasAllOwn(object, [...keys])
assert.lacksAllOwn(object, [...keys])

// Via `assert.matchStrict`
assert.deeplyHasAllOwn(object, [...keys])
assert.deeplyLacksAllOwn(object, [...keys])

// Via SameValueZero
assert.exactlyHasAllOwn(object, [...keys])
assert.exactlyLacksAllOwn(object, [...keys])
```

Assert that an object has (or lacks) zero or more keys, either own or inherited. It's primarily useful for testing more arcane details with things like polyfills or proxies.

## Map/Set keys

```js
// Via `assert.matchLoose`
assert.hasAllKeys(map, [...keys])
assert.lacksAllKeys(map, [...keys])

// Via `assert.matchStrict`
assert.deeplyHasAllKeys(map, [...keys])
assert.deeplyLacksAllKeys(map, [...keys])

// Via SameValueZero
assert.exactlyHasAllKeys(map, [...keys])
assert.exactlyLacksAllKeys(map, [...keys])
```

Assert that a map or set has (or lacks) zero or more keys. Anything resembling a map or set works, including a [normal map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), a [weak set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet), or even an [ImmutableJS list](https://facebook.github.io/immutable-js/docs/#/List). It just needs a `has` method which accepts the given key.
