[*Up*](./README.md)

# Utilities

This also has several utility methods, so you can create your own assertions and still make them just as clean, neat, and native-looking as the built-in ones. No more of this:

```js
// AssertionError: Something isn't right
assert(something.isntRight(), "Something isn't right")
```

Instead, this could look like this, with beautiful error messages to match:

```js
// AssertionError: Something isn't right: expected 1, found 2
if (something.isntRight()) {
    assert.failFormat(
        "Something isn't right: expected {expected}, found {actual} " +
        "with some weird {whatever}",
        {expected: good, actual: bad, whatever}
    )
}
```

## `assert.format(message, opts, formatter?)`

```js
var formattedMessage = assert.format(message, opts={}, prettify=util.inspect)
```

Create a formatted message from the template `message`, using `opts` to fill it in and `prettify` to pretty-print it to a string.

## `assert.failFormat(message?, opts?, prettify?)`

```js
assert.failFormat(message="", opts={}, prettify=util.inspect)
```

This is sugar for `throw new assert.AssertionError(assert.format(message, opts, prettify), opts.actual, opts.expected)`, but is a little more efficient internally.

## `assert.escape(string)`

```js
var escaped = assert.escape(string)
```

Escape a string so that `assert.format` returns the raw string instead of "pretty-printing" it (e.g. for function names injected into templates).

## `assert.matchLoose(a, b)`

```js
var matches = assert.matchLoose(a, b)
```

Compare two values, either primitives or objects, structurally. This takes into account their native types (like with dates and typed arrays), but not their prototypes otherwise.

## `assert.matchStrict(a, b)`

```js
var matches = assert.matchStrict(a, b)
```

Compare two values, either primitives or objects, structurally, but also verify that their prototypes match (and their children, recursively).

## How does the structural matching work?

They compare two values recursively, taking their string keys into account, as well as internal data within maps, sets, array buffers, data views, and the various typed arrays. Here are the main rules surrounding object matching:

- Primitives only match other primitives.
- Wrapper objects are treated as normal objects, not their primitives. Their contents are not compared when checking, either.
- Dates are matched for their values.
- Arrays, typed arrays, and `arguments` objects are matched for their entries, and only match other objects of the same type as them. This also carries over to typed array subclasses - a `Uint8Array` isn't going to match an `Int32Array`'s entries.
- Data views and array buffers are matched for their inner data, and only match other objects of the same type as them.
- Object keys, map keys, and set entries are compared in an order-independent fashion.
- Objects with special data matching semantics, such as with maps, arrays, and dates, only match against other objects inheriting from the same basic type. In addition, expando properties on such objects are ignored.
- The `message` property on errors are matched for equality and the `stack` property is ignored. Otherwise, errors are compared as normal objects.
- When matching loosely:
    - Symbols are compared for their description.
    - Prototypes are ignored for objects unless their internal contents (like for an array or data view) would otherwise be checked.
- When matching strictly:
    - Symbols are compared for identity.
    - Prototypes are always checked to be equal.

In addition to the rules above, this does attempt to retain sane behavior in the face of odd and unusual native types and such.

- It works with the core-js Symbol polyfill if it's the global, and they are checked just like the native primitives.
- This is somewhat defensive against buggy legacy engines. (e.g. Safari, PhantomJS)
- This accepts Browserify's `Buffer` polyfill in Node.
- This intentionally avoids Browserify's global detection beyond just `global`.

## Why roll my own deep equality algorithm?

There's many reasons:

1. It's not that uncommon just to want to assert that two values match without checking their types.
2. Most deep equality algorithms are slow, with Node's native `assert` and Lodash's `_.matches` being the primary exceptions.
3. Most deep equality algorithms aren't ES6-aware, especially when maps and sets get into the picture.
4. Error stacks are practically useless when matching them. In addition, PhantomJS and IE both generate the stack *when the error is thrown*, not when it was created.
5. It's often helpful to match symbols, dates, and other value-like types for their value, not their identity. This even carries over to maps and sets: you would expect `_.matches(new Set(1, 2, 3), new Set(3, 2, 1))` to return `true`, especially if you're just asserting what the set has, but most algorithms out there return `false` for this.
