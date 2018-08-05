[*Up*](./README.md)

# One of many keys' existence

If you need to check whether at least one of a number of keys exist within an object, these are the assertions you're looking for.

Note that in each of these, the list of keys doesn't have to be an array - it can be any collection, including array-likes like `arguments` objects and generic iterables of keys like sets.

## Object property keys

```js
// Via `assert.matchLoose`
assert.hasAnyIn(object, [...keys])
assert.lacksAnyIn(object, [...keys])

// Via `assert.matchStrict`
assert.deeplyHasAnyIn(object, [...keys])
assert.deeplyLacksAnyIn(object, [...keys])

// Via SameValueZero
assert.exactlyHasAnyIn(object, [...keys])
assert.exactlyLacksAnyIn(object, [...keys])
```

Assert that an object has (or lacks) at least one of a number of keys, either own or inherited. It's pretty basic.

## Own property keys

```js
// Via `assert.matchLoose`
assert.hasAnyOwn(object, [...keys])
assert.lacksAnyOwn(object, [...keys])

// Via `assert.matchStrict`
assert.deeplyHasAnyOwn(object, [...keys])
assert.deeplyLacksAnyOwn(object, [...keys])

// Via SameValueZero
assert.exactlyHasAnyOwn(object, [...keys])
assert.exactlyLacksAnyOwn(object, [...keys])
```

Assert that an object has (or lacks) at least one of a number of keys, either own or inherited. It's primarily useful for testing more arcane details with things like polyfills or proxies.

## Map/Set keys

```js
// Via `assert.matchLoose`
assert.hasAnyKey(map, [...keys])
assert.lacksAnyKey(map, [...keys])

// Via `assert.matchStrict`
assert.deeplyHasAnyKey(map, [...keys])
assert.deeplyLacksAnyKey(map, [...keys])

// Via SameValueZero
assert.exactlyHasAnyKey(map, [...keys])
assert.exactlyLacksAnyKey(map, [...keys])
```

Assert that a map or set has (or lacks) at least one of a number of keys. Anything resembling a map or set works, including a [normal map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), a [weak set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet), or even an [ImmutableJS list](https://facebook.github.io/immutable-js/docs/#/List). It just needs a `has` method which accepts the given key.
