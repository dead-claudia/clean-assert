[*Up*](./README.md)

# Type checking

The type checking methods are themselves pretty limited and intentionally simple, but they cover pretty much all your type checking needs.

## `assert.ok`/`assert.notOk`

```js
assert.ok(value)
assert.notOk(value)
```

Assert whether this value is neither `null` nor `undefined` (or that it *is* one of them, in the case of `notOk`). This is useful if you're dealing with Node callbacks, where you might want to assert a callback error doesn't exist.

## `assert.is(Type, value)`/`assert.not(Type, value)`

Assert that this is (or isn't) of a particular type. `Type` can be any of the following, and that's the type check performed:

- `"array"` - whether this value is an [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array). It's much less verbose than `assert.assert(Array.isArray(value))`, and it gives better error messages
- `"iterable"` - whether this value is an [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols). It's much simpler than the long `assert.assert(value != null && typeof value[Symbol.iterator] === "function")`, and it's getting that concept out of your way of actually doing things.
- `"array-like"` - whether this value is an [array-like object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections), such as an array, typed array, or a [`NodeList`](https://developer.mozilla.org/en-US/docs/Web/API/NodeList). It's much simpler than the long `assert.assert(value != null && typeof value.length === "number")`, and it's getting that concept out of your way of actually doing things.
- `"reference"` - whether this value is a reference type, either an object or a function.  It's much simpler than the long `assert.assert(value != null && (typeof value === "function" || typeof value === "object"))`, and it properly encapsulates the concept of "this is something you can add, remove, or modify properties on". You should generally prefer this over `assert.is("object", value)` if you want to assert something returns a value you can manipulate properties on.
- Any other string - whether `typeof value === Type`. It's more concise than `assert.assert(typeof value === "object")`, and it also guards against `null`/`undefined`.
- A function or object implementing `Symbol.hasInstance` - whether `value instanceof Type`. It's much more concise than `assert.assert(value instanceof Type)`, it has better error messages, and it even plays well with polyfills and transpilers, if you choose to [use Babel's upcoming plugin](https://babeljs.io/docs/en/next/babel-plugin-transform-instanceof.html).

Note that if you wish to check `typeof value === "undefined"`, just use `assert.equal(value, undefined)`. It'll provide more or less the same error message, and it's more explicit. (There's only one `undefined` value.) Also, due to direct consequence of `null`/`undefined` being filtered out, `assert.is("object", null)` *will* throw. If you *really* mean to treat `null` as both separate from `undefined` and as the same as anything else that's `typeof value === "object"`, you should just use `assert.assert(typeof value === "object")` directly. (It's almost never what you mean to do, hence why I didn't explicitly support it.)

## `assert.possibly(Type, ...)`/`assert.notPossibly(Type, ...)`

```js
assert.possibly(Type, value)
assert.notPossibly(Type, value)
```

Assert that this is (or isn't) either `null`, `undefined`, or of a particular type listed above. Any `is`/`not` type, including both `typeof` types, special types, and constructors, are accepted, and they all work as you'd expect. It's just like prefixing it with `if (value != null)`, but a little shorter.
