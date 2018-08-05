[*Up*](./README.md)

# Equality

If you've ever needed to compare equality, these are the assertions you're looking for.

## Simple equality

```js
// Via `assert.matchLoose`
assert.equal(actual, expected)
assert.notEqual(actual, expected)

// Via `assert.matchStrict`
assert.deeplyEqual(actual, expected)
assert.deeplyNotEqual(actual, expected)

// Via SameValueZero
assert.exactlyEqual(actual, expected)
assert.exactlyNotEqual(actual, expected)
```

Assert that two values are (or aren't) equal or identical. This is probably going to amount to the majority of your assertions, which is why this exists. It comes in three variants:

- If you need value equality and prototypes don't matter, use the normal `assert.equal`.
- If you need value equality, but you *do* care about prototypes, use `assert.deeplyEqual`.
- If you're comparing objects and need to check identity, use `assert.exactlyEqual`.

You'll see this common theme throughout most other assertions, so if you get this, you get the entire library.

## One of multiple values

```js
// Via `assert.matchLoose`
assert.equalsAny(actual, [...expected])
assert.equalsNone(actual, [...expected])

// Via `assert.matchStrict`
assert.deeplyEqualsAny(actual, [...expected])
assert.deeplyEqualsNone(actual, [...expected])

// Via SameValueZero
assert.exactlyEqualsAny(actual, [...expected])
assert.exactlyEqualsNone(actual, [...expected])
```

Assert that a value is one of multiple given values. This is like a reverse [`assert.includes`](../include.md), but it's much more obvious as to the intent. That last collection can be anything from an array to an iterable to an array-like value.

There is no `assert.equalsAll` method because `assert.equals` works well enough, and the inverse, "assert value doesn't equal at least one value from this list", is so niche I've literally never seen nor heard of a genuine use case for it. It's also unclear what the latter should be called.

## Notes

There are two important notes for each of these methods:

### Floats

```js
// Extremely bad. Don't ever do this. The below line will fail, despite being
// mathematically correct.
assert.equal(average([132, 125, 142, 235, 891, 432, 771, 329, 112, 224]), 339.3)

function average(values) {
    return values.reduce((acc, value) => acc + value / values.length, 0)
}
```

If you're comparing floats for equality after doing *any* manipulation with them, ***👏 do 👏 not 👏 use 👏 these 👏 methods 👏!!!*** They will almost certainly ***not*** do what you want, because thanks to rounding errors and the inherent nature of floating-point precision, [it will almost always be imprecise](https://floating-point-gui.de/errors/comparison/). Instead, you should be using [`assert.closeTo`](./number.md#relative-float-checking), which handles that for you.

There are three exceptions to this rule: `NaN`, `Infinity`, and `-Infinity`. If you want to assert that a number is one of those three values, `assert.equal` would still work, and it's probably better. (You can't be "close to" either of those three values without being actually equal.)

### Choice of default matching

The default is structural equality, and this is by design. No, it's not going to slow down your tests - I've got the matching algorithm heavily benchmarked and optimized (it's within a factor of 2-3 from Lodash's `_.matches`). The reason I do this is because you can do things like `assert.equal(someValue, new Set(1, 2, 3))` and it just works, even if `someValue` is `new Set(3, 1, 2)`. You can also do `assert.equal(someValue, {foo: 1, bar: 2})`. In my experience, identity is usually *not* the thing you're trying to assert, and so this is sufficient. Oh, and the matching algorithm is benchmarked, so I can test for performance regressions. Most testing frameworks don't do this.
