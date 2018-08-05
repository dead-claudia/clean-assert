[*Up*](./README.md)

# Exception testing

Sometimes, you need to check if something throws an exception. That's what these are for.

## `assert.throws(Type, ...)`

```js
assert.throws(Type, function () {
    // do something
})
```

Assert that a function throws a value satisfying a particular type. Any type that works with [`assert.is`](./type.md) can work, including `"string"` and even `"reference"`.

## `assert.throwsMatching(matcher, ...)`

```js
assert.throwsMatching(matcher, function () {
    // do something
})
```

Assert that a function throws a value satisfying a particular matcher. Here's how that's matched:

- If `matcher` is a function, this checks whether it threw and `matcher(err)` returned truthy for it.
- If `matcher` is a string, this checks whether it threw and `err.message === matcher`.
- If `matcher` is a RegExp, this checks whether it threw and `err.message === /matcher/`.
- If `matcher` is any other object, this checks whether it threw and whether the keys of `err` match the corresponding ones in `matcher`.
