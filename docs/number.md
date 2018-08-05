[*Up*](./README.md)

# Numeric comparison

Sometimes, you need to compare numbers. This is exactly what this is for.

## Inequalities

```js
assert.atLeast(num, limit) // num ≥ limit
assert.atMost(num, limit)  // num ≤ limit
assert.above(num, limit)   // num > limit
assert.below(num, limit)   // num < limit
```

Assert that this is at least, at most, above, or below a number. It's just as it sounds, and `NaN`s always fail.

## Range checking

```js
assert.between(num, lower, upper)    // lower ≤ num ≤ upper
assert.notBetween(num, lower, upper) // num < lower or num > upper
```

Assert that this is (or isn't) between two numbers. It's pretty obvious, but `NaN`s always fail as usual.

## Relative float checking

```js
assert.closeTo(actual, expected, tolerance=1e-8)
assert.notCloseTo(actual, expected, tolerance=1e-8)
```

Assert that this is (or isn't) close to a number, with a given optional uncertainty tolerance. Conceptually, it's checking `(actual = expected) ± tolerance × relativeError`, which is the proper way to test floats. Note that this always returns `false` if any of the three parameters are `NaN`s.

If you ever find yourself wanting to comparing decimals by value for equality and not identity, ***👏 use 👏 this 👏 method 👏!!!*** Otherwise, the comparison [may very likely fail even if they seem equal](https://floating-point-gui.de/basic/), because JS "numbers" are [fixed-size IEEE 754 doubles](https://en.wikipedia.org/wiki/Double-precision_floating-point_format) with only 64 bits to store the number's value. These are most certainly *not* the infinite-precision numbers you experience in mathematics.

Note that in general, your tolerance is going to be pretty small, since it's based on values close to 0-1. However, this does scale with your values, so just because your values are in the millions doesn't mean your tolerance should be. Usually, the default is fine for day-to-day uses, but you might occasionally need to tune it if your numbers need more (or less) precision.

The algorithm is loosely based on [this floating point guide](https://floating-point-gui.de/errors/comparison/). Fun fact, floats are very non-trivial to work with.
