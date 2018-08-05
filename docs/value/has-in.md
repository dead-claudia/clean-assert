[*Up*](./README.md)

# Object property equality

Sometimes, you want to check that one or more properties exist in an object with a particular value. That's what these assertions are for.

## Single key equality

```js
// Via `assert.matchLoose`
assert.hasIn(object, key, expected)
assert.lacksIn(object, key, expected)

// Via `assert.matchStrict`
assert.deeplyHasIn(object, key, expected)
assert.deeplyLacksIn(object, key, expected)

// Via SameValueZero
assert.exactlyHasIn(object, key, expected)
assert.exactlyLacksIn(object, key, expected)
```

Assert that an object has (or lacks) a single property, own or inherited, equal to `expected`. It's better than `assert.equal(object.key, expected)`, since it can more likely catch cases where you might have typo'd, and the messages are a bit more helpful than `Expected undefined to match <some value>` assertions.

## Multiple keys' equality

```js
// Via `assert.matchLoose`
assert.hasAllIn(object, {...pairs})
assert.lacksAllIn(object, {...pairs})

// Via `assert.matchStrict`
assert.deeplyHasIn(object, {...pairs})
assert.deeplyLacksIn(object, {...pairs})

// Via SameValueZero
assert.exactlyHasIn(object, {...pairs})
assert.exactlyLacksIn(object, {...pairs})
```

Assert some object has (or lacks), own or inherited, all of a set of key/value pairs. This is useful for checking multiple properties at once without nearly as much boilerplate.

## One of many keys' equality

```js
// Via `assert.matchLoose`
assert.hasAnyIn(object, {...pairs})
assert.lacksAnyIn(object, {...pairs})

// Via `assert.matchStrict`
assert.deeplyHasAnyIn(object, {...pairs})
assert.deeplyLacksAnyIn(object, {...pairs})

// Via SameValueZero
assert.exactlyHasAnyIn(object, {...pairs})
assert.exactlyLacksAnyIn(object, {...pairs})
```

Assert some object has (or lacks), own or inherited, at least one of a set of key/value pairs. This is useful for checking multiple properties at once without nearly as much boilerplate, and it lets you avoid having to roll your own assertion just to do something obvious.
