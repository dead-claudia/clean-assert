[*Up*](./README.md)

# Value inclusion

If you've got an array, array-like (like `arguments` or a DOM node list), or any iterable (like a set or generator instance), and you need to know if one or more values exist within it, that's what these assertions are for.

Note that in each of these, the collection and value list (for `assert.includesAll`, `assert.includesAny`, and friends) doesn't have to be an array - it can be any collection, including array-likes like `arguments` objects and generic iterables of keys like sets.

## Includes single value

```js
// Via `assert.matchLoose`
assert.includes(coll, value)
assert.excludes(coll, value)

// Via `assert.matchStrict`
assert.deeplyIncludes(coll, value)
assert.deeplyExcludes(coll, value)

// Via SameValueZero
assert.exactlyIncludes(coll, value)
assert.exactlyExcludes(coll, value)
```

Assert some collection includes (or excludes) a single value. All three variants are supported, so you can check structurally with `assert.includes(someArray, {foo: "bar"})` or for some exact object with `assert.exactlyIncludes(someList, myObject)`.

## Includes all values

```js
// Via `assert.matchLoose`
assert.includesAll(coll, [...values])
assert.excludesAll(coll, [...values])

// Via `assert.matchStrict`
assert.deeplyIncludesAll(coll, [...values])
assert.deeplyExcludesAll(coll, [...values])

// Via SameValueZero
assert.exactlyIncludesAll(coll, [...values])
assert.exactlyExcludesAll(coll, [...values])
```

Assert some collection includes (or excludes) all of a set of values. Yet again, all three variants are supported, so you can check structurally with `assert.includesAll(someArray, [{foo: 1}, {bar: 2}])` or for some exact object with `assert.exactlyIncludesAll(someList, [object1, object2])`.

## Includes any value

```js
// Via `assert.matchLoose`
assert.includesAny(coll, [...values])
assert.excludesAny(coll, [...values])

// Via `assert.matchStrict`
assert.deeplyIncludesAny(coll, [...values])
assert.deeplyExcludesAny(coll, [...values])

// Via SameValueZero
assert.exactlyIncludesAny(coll, [...values])
assert.exactlyExcludesAny(coll, [...values])
```

Assert some collection includes (or excludes) at least one of a set of values. Likewise, all three variants are supported, so you can check structurally with `assert.includesAny(someArray, [{foo: 1}, {bar: 2}])` or for some exact object with `assert.exactlyIncludesAny(someList, [object1, object2])`.
