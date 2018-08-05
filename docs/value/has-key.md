[*Up*](./README.md)

# Map key equality

Sometimes, you want to check that one or more key/value pairs exist in a map. That's what these assertions are for.

Note that for multiple values, your keys can only be strings or symbols - you can't check indices. Usually, for most other scenarios, [`assert.includes`](../include.md) is more appropriate, and when not, you can use `assert.hasKey` or similar directly.

## Single key equality

```js
// Via `assert.matchLoose`
assert.hasKey(map, key, expected)
assert.lacksKey(map, key, expected)

// Via `assert.matchStrict`
assert.deeplyHasKey(map, key, expected)
assert.deeplyLacksKey(map, key, expected)

// Via SameValueZero
assert.exactlyHasKey(map, key, expected)
assert.exactlyLacksKey(map, key, expected)
```

Assert that a map has (or lacks) a single `key` whose value is equal to `expected`. Anything resembling a map works, including a [normal map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), a [weak map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap), or even an [ImmutableJS list](https://facebook.github.io/immutable-js/docs/#/List). It just needs a `has` method and a `get` method, each which accept the key.

## Multiple keys' equality

```js
// Via `assert.matchLoose`
assert.hasAllKeys(map, {...pairs})
assert.lacksAllKeys(map, {...pairs})

// Via `assert.matchStrict`
assert.deeplyHasKeys(map, {...pairs})
assert.deeplyLacksKeys(map, {...pairs})

// Via SameValueZero
assert.exactlyHasKeys(map, {...pairs})
assert.exactlyLacksKeys(map, {...pairs})
```

Assert some map has (or lacks), all of a set of key/value pairs. This is useful for checking multiple properties at once without nearly as much boilerplate.

## One of many keys' equality

```js
// Via `assert.matchLoose`
assert.hasAnyKey(map, {...pairs})
assert.lacksAnyKey(map, {...pairs})

// Via `assert.matchStrict`
assert.deeplyHasAnyKey(map, {...pairs})
assert.deeplyLacksAnyKey(map, {...pairs})

// Via SameValueZero
assert.exactlyHasAnyKey(map, {...pairs})
assert.exactlyLacksAnyKey(map, {...pairs})
```

Assert some map has (or lacks), at least one of a set of key/value pairs. This is useful for checking multiple properties at once without nearly as much boilerplate, and it lets you avoid having to roll your own assertion just to do something obvious.
