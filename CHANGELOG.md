# Changelog

## v3.0.0

*Note: everything before this version's changelog was filled in retroactively.*

- Remove `assert.async` API without replacement.
    - Just use the `assert.*` methods directly within your `.then` callbacks.
- Bring `clean-assert-util` and `clean-match` into the library itself and remove their dependencies.
- Fix a few outstanding bugs and docs issues.
- Add a `global.js` bundle for easier browser loading.
- Optimize `assert.includes` and friends' matching algorithm.
- Simplify the internals some.
- Support array-like collections in `assert.includes` and friends.
- Add `assert.equalsAny(actual, [...expected])` and corresponding `assert.equalsNone(actual, [...expected])` to replace the abuse of `assert.includes` and `assert.includesAny` I was starting to do.
- Remove several stray Thallium remnants within the code base.
- Add a *lot* more tests, and cover most permutations.
- Revise and reorganize documentation.
- Streamline public API by:
    - Recasting the high-level API to be simpler and more consistent.
    - Renaming several methods to use proper English
    - Using a single method for type checking and reusing the logic for `assert.throws`.

## v2.0.0

- Fix argument order from `expected, actual` to `actual, expected`

## v1.2.0

- Support iterators for key lists.
- Add iterable type checks.
- Support iterables in `assert.includes` and friends.

## v1.1.1

- Add a couple files missed from a broken `npm publish`

## v1.1.0

- Add `assert.async` API for working with promises

## v1.0.0

First stable release
