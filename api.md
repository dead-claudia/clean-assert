# Assertions

```js
const assert = require("assert")
```

Within `clean-assert`, there are about 75 different assertions, but they're each variations of the same few concepts. I've separated them all into several groups, so it's a bit easier to parse and look through.

Do note that you don't have to use these, and matter of fact, any assertion library works with this. You could even use Chai if you wanted to. Consider this a useful built-in assertion library in case you prefer batteries included.

- [Basic methods/properties](#sec-basic)
- [Type checking](#sec-type)
- [Equality](#sec-equality)
- [Range checking](#sec-range)
- [Exception checking](#sec-exception)
- [Key checking](#sec-key)
- [Includes in iterable](#sec-includes)
- [Has key-value pairs in object](#sec-has)
- [Utility methods](#sec-utility)

<a id="sec-basic"></a>
## Basic methods/properties

Just like any assertion library, this has the obligatory basics.

### assert.assert(condition, message?)

```js
assert.assert(condition, message="", actual=undefined, expected=undefined)
```

The basic assert method. Most assertion libraries have some variant of this: test a `condition`, and if it's falsy, throw an assertion error with a `message`. You can also set the `actual` and `expected` of the resulting assertion error using this, where `message` is just a template accepting `{actual}` and `{expected}` parameters.

The last two parameters are so you can create easy assertions on the spot, or even customize existing ones, without the this silly nonsense:

```js
// AssertionError: Something isn't right
assert(!something.isntRight(), "Something isn't right")
```

Instead, this could look like this, with beautiful error messages to match:

```js
// AssertionError: Something isn't right: expected 1, found 2
assert(!something.isntRight(),
    "Something isn't right: expected {expected}, found {actual}",
    good, bad
)
```

### assert.fail(message?)

```js
assert.fail(message="", actual=undefined, expected=undefined)
```

This is sugar for `assert.assert(false, ...args)`.

### class assert.AssertionError

```js
new assert.AssertionError(message="", expected=undefined, actual=undefined)
```

The assertion error constructor used in this assertion library. Don't worry, it's only used here, and the rest of Thallium really doesn't care what assertion library you use, if any. It simply checks for the error's `name` to be `"AssertionError"`, nothing else.

<a id="sec-type"></a>
## Type checking

There are several type checking-related assertions, engineered for clarity and conciseness.

### Truthy/falsy with assert.ok and assert.notOk

```js
assert.ok(value)
assert.notOk(value)
```

Assert whether a value is truthy or falsy.

### Primitive types

```js
assert.isBoolean(value)
assert.isFunction(value)
assert.isNumber(value)
assert.isObject(value)
assert.isString(value)
assert.isSymbol(value)
assert.notBoolean(value)
assert.notFunction(value)
assert.notNumber(value)
assert.notObject(value)
assert.notString(value)
assert.notSymbol(value)
```

Assert with `typeof` whether a value is of a certain primitive type.

Notes:

- If you want to test `typeof value === "undefined"`, use `assert.equal(value, null)` instead - having an extra method for just a single primitive value would be redundant.
- `assert.isObject(null)` will fail, even though `typeof null === "object"`. It's working around [one of the language's warts](http://www.2ality.com/2013/10/typeof-null.html) that sadly can't be fixed because [it breaks too many things](http://wiki.ecmascript.org/doku.php?id=harmony:typeof_null).

### Existence

```js
assert.exists(value)
assert.notExists(value)
```

Assert whether a value exists (i.e. either `null` or `undefined`)

### Arrays

```js
assert.isArray(value)
assert.notArray(value)
```

Assert whether a value is an array.

### Iterables

```js
assert.isIterable(value)
assert.notIterable(value)
```

Assert whether a value is an iterable object.

### Instance type

```js
assert.is(Type, value)
assert.not(Type, value)
```

Assert whether a value is `instanceof` an object type.

<a id="sec-equality"></a>
## Equality

There are also, of course, several equality methods.

### Primitive equality

```js
assert.equal(actual, expected)         // strict, expected === actual
assert.equalLoose(actual, expected)    // loose, expected == actual
assert.notEqual(actual, expected)      // strict, expected !== actual
assert.notEqualLoose(actual, expected) // loose, expected != actual
```

Assert whether a value equals another value, with strict or loose equality.

Note: if you're checking floats/decimals for equality, don't use this method, because it will frequently get things wrong. Use `assert.closeTo()` or `assert.notCloseTo()` (below) instead

### Floating point equality

```js
assert.closeTo(actual, expected, tolerance=1e-10)
assert.notCloseTo(actual, expected, tolerance=1e-10)
```

Assert whether a float/decimal is equal to a certain value, given an optional tolerance (since floats [have a habit](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html) of [being imprecise](http://softwareengineering.stackexchange.com/a/101170)). This is the preferred way to compare two floats for equality.

The default tolerance is for convenience - you shouldn't need to specify how precise each time you compare two floats. Also, in case you're wondering, here's how it's checked (stops after the first step that works):

- If any number is `NaN`, it's not considered close.
- If the tolerance is infinite, it's considered close.
- If they're identical (with `===`), then it's considered close.
- If the tolerance is zero, then it's not considered close.
- If either float is zero, then the other is compared to the tolerance via `|value| < tolerance`
- Otherwise, it's compared to the tolerance via `|expected/actual - 1| < tolerance`

### Deep equality

```js
assert.deepEqual(actual, expected)
assert.match(actual, expected)
assert.notDeepEqual(actual, expected)
assert.notMatch(actual, expected)
```

Assert whether a value deeply equals another value. `deepEqual` and `notDeepEqual` check the prototypes as well, and use the [`assert.matchStrict(a, b)`](#assertmatchstricta-b) method internally, but `match` and `notMatch` only check the properties (with a few caveats), and use the [`assert.matchLoose(a, b)`](#assertmatchloosea-b) method internally. See the documentation for those two methods if you want more info.

<a id="sec-range"></a>
## Range checking

There are several methods to deal with ranges and inequalities.

```js
assert.atLeast(number, limit) // number >= limit
assert.atMost(number, limit) // number <= limit
assert.above(number, limit) // number > limit
assert.below(number, limit) // number < limit
assert.between(number, lower, upper) // lower <= number <= upper
```

Assert that a number is within some set of bounds. The comments detail what comparison is checked. Note that `between` is inclusive on both ends, and could be considered shorthand for the following:

```js
assert.between(number, lower, upper) // lower <= number <= upper
assert.atLeast(number, lower) // number >= limit
assert.atMost(number, upper) // number <= limit
```

<a id="sec-exception"></a>
## Exception checking

There are a few methods to deal with exceptions.

```js
assert.throws(callback)
assert.throws(Type, callback)
assert.throwsMatch(matcher, callback)
```

Assert that a callback throws, optionally either `instanceof Type` (for the first form) or matching a `matcher` (for the second form). In the case of the second, the `matcher` can be any of these:

- A string, which the error's message is checked to equal
- A regular expression, which the error's message is checked to match
- A function, which receives the error and has its result checked to be truthy
- An object literal, which those properties (not necessarily own) of the error are checked to be equal

<a id="sec-key"></a>
## Key checking

There are several key checking methods, for own object keys, inherited object keys, and map keys.

### Own keys

```js
assert.hasOwn(object, key)
assert.notHasOwn(object, key)
```

Assert whether an object has an own key.

```js
assert.hasOwn(object, key, value)
assert.hasOwnLoose(object, key, value)
assert.notHasOwn(object, key, value)
assert.notHasOwnLoose(object, key, value)
```

Assert whether an object has an own key either strictly (`===`/`!==`) or loosely (`==`/`!=`) equal to a value.

### Own or inherited keys

```js
assert.hasKey(object, key)
assert.notHasKey(object, key)
```

Assert whether an object has an own or inherited key. This even includes `Object.prototype` methods like `toString` for most objects.

```js
assert.hasKey(object, key, value)
assert.hasKeyLoose(object, key, value)
assert.notHasKey(object, key, value)
assert.notHasKeyLoose(object, key, value)
```

Assert whether an object has an own or inherited key either strictly (`===`/`!==`) or loosely (`==`/`!=`) equal to a value.

### Map keys

```js
assert.has(object, key)
assert.notHas(object, key)
```

Assert whether a [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) has a key.

```js
assert.has(object, key, value)
assert.hasLoose(object, key, value)
assert.notHas(object, key, value)
assert.notHasLoose(object, key, value)
```

Assert whether a [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) has a key either strictly (`===`/`!==`) or loosely (`==`/`!=`) equal to a value.

<a id="sec-includes"></a>
## Includes in iterable

There's also some larger methods to test many possibilities at once.

It may seem like there's a lot of methods here, and that's pretty true, but it's simpler than it looks. Here's a quick overview of how they're sorted:

              |     shallow      |     strict deep      |   structural deep
--------------|------------------|----------------------|-----------------------
includes all  | `includes`       | `includesDeep`       | `includesMatch`
includes some | `includesAny`    | `includesAnyDeep`    | `includesAnyMatch`
missing some  | `notIncludesAll` | `notIncludesAllDeep` | `notIncludesAllMatch`
missing all   | `notIncludes`    | `notIncludesDeep`    | `notIncludesMatch`

### Includes all values

```js
// Single
assert.includes(iter, value)
assert.includesDeep(iter, value)
assert.includesMatch(iter, value)

// Multiple
assert.includes(iter, [...values])
assert.includesDeep(iter, [...values])
assert.includesMatch(iter, [...values])
```

Assert an iterable includes one or more values.

### Includes some values

```js
assert.includesAny(iter, [...values])
assert.includesAnyDeep(iter, [...values])
assert.includesAnyMatch(iter, [...values])
```

Assert an iterable includes at least one of a list of values

### Missing some values

```js
assert.notIncludesAll(iter, [...values])
assert.notIncludesAllDeep(iter, [...values])
assert.notIncludesAllMatch(iter, [...values])
```

Assert an iterable is missing at least one of a list of values

### Missing all values

```js
// Single
assert.notIncludes(iter, value)
assert.notIncludesDeep(iter, value)
assert.notIncludesMatch(iter, value)

// Multiple
assert.notIncludes(iter, [...values])
assert.notIncludesDeep(iter, [...values])
assert.notIncludesMatch(iter, [...values])
```

Assert an iterable does not include one or more values.

<a id="sec-has"></a>
## Has key-value pairs in object

Just like testing for multiple values in iterables, you can also test for multiple key-value pairs in objects. These are checked to be own properties, not inherited, and it can be considered a more flexible shorthand for multiple `assert.hasOwn` calls.

It may seem like there's a lot of methods here, and that's pretty true, but it's simpler than it looks. Here's a quick overview of how they're sorted:

              |     shallow     |    strict deep      |   structural deep
--------------|-----------------|---------------------|----------------------
includes all  | `hasKeys`       | `hasKeysDeep`       | `hasKeysMatch`
includes some | `hasKeysAny`    | `hasKeysAnyDeep`    | `hasKeysAnyMatch`
missing some  | `notHasKeysAll` | `notHasKeysAllDeep` | `notHasKeysAllMatch`
missing all   | `notHasKeys`    | `notHasKeysDeep`    | `notHasKeysMatch`

### Has keys

```js
assert.hasKeys(object, [...keys]) // includes all
assert.hasKeysAny(object, [...keys]) // includes some
assert.notHasKeysAll(object, [...keys]) // missing some
assert.notHasKeys(object, [...keys]) // missing all
```

Assert whether an object has one or more keys. The comments detail how they're checked.

### Has all key-value pairs

```js
assert.hasKeys(object, {key: value, ...})
assert.hasKeysDeep(object, {key: value, ...})
assert.hasKeysMatch(object, {key: value, ...})
```

Assert an object includes one or more values.

### Has some key-value pairs

```js
assert.hasKeysAny(object, {key: value, ...})
assert.hasKeysAnyDeep(object, {key: value, ...})
assert.hasKeysAnyMatch(object, {key: value, ...})
```

Assert an object includes at least one of a list of key/value pairs

### Missing some key-value pairs

```js
assert.notHasKeysAll(object, {key: value, ...})
assert.notHasKeysAllDeep(object, {key: value, ...})
assert.notHasKeysAllMatch(object, {key: value, ...})
```

Assert an object is missing at least one of a list of key/value pairs

### Missing all key-value pairs

```js
assert.notHasKeys(object, {key: value, ...})
assert.notHasKeysDeep(object, {key: value, ...})
assert.notHasKeysMatch(object, {key: value, ...})
```

Assert an object does not include one or more key/value pairs.

<a id="sec-utility"></a>
## Utility methods

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

### assert.format(message, opts, formatter?)

```js
var formattedMessage = assert.format(message, opts={}, prettify=util.inspect)
```

Create a formatted message from the template `message`, using `opts` to fill it in and `prettify` to pretty-print it to a string.

### assert.failFormat(message?, opts?, prettify?)

```js
assert.failFormat(message="", opts={}, prettify=util.inspect)
```

This is sugar for `throw new assert.AssertionError(assert.format(message, opts, prettify), opts.actual, opts.expected)`, but is a little more efficient internally.

### assert.escape(string)

```js
var escaped = assert.escape(string)
```

Escape a string so that `assert.format` returns the raw string instead of "pretty-printing" it (e.g. for function names injected into templates).

### assert.matchLoose(a, b)

```js
var matches = assert.matchLoose(a, b)
```

Compare two values, either primitives or objects, structurally without regard to their prototypes. Note that this does still do some type checking:

- Primitives and their wrapper objects do not match
- Symbols are checked for their description, not for identity
- Dates are matched through their values
- Arrays don't match plain objects or `arguments`
- Typed arrays don't match anything other than another array of the same type
- Objects, maps, and sets have their contents compared in an order-independent fashion
- It checks typed arrays, Buffers, ArrayBuffers and DataViews
- Expando properties aren't checked on arrays/maps/sets/etc.
- It works with the core-js Symbol polyfill if it's the global, and they are checked just like the native primitives
- It ignores the `stack` property on Errors
- Objects that are specially handled (e.g. Dates, arrays, `arguments`, Errors) are checked to have the same prototype.

Here's a couple other notes:

- This is somewhat defensive against buggy legacy engines. (e.g. Safari, PhantomJS)
- This accepts Browserify's `Buffer` polyfill in Node.
- This intentionally avoids Browserify's global detection beyond just `global`.

### assert.matchStrict(a, b)

```js
var matches = assert.matchStrict(a, b)
```

Compare two values, either primitives or objects, structurally, but also verify that their prototypes match (and their children, recursively). The above notes for `assert.matchLoose` also apply, except that symbols are checked for identity instead.

### Why roll my own deep equality algoritm?

There's many reasons:

1. It's not that uncommon just to want to assert that two values match without checking their types.
2. Most deep equality algorithms are slow, with Node's native `assert` and Lodash's `_.matches` being the primary exceptions.
3. Most deep equality algorithms aren't ES6-aware, especially when maps and sets get into the picture.
4. Error stacks are practically useless when matching them. In addition, PhantomJS and IE both generate the stack *when the error is thrown*, not when it was created.
5. It's often helpful to match symbols, dates, and other value-like types for their value, not their identity. This even carries over to maps and sets: you would expect `_.matches(new Set(1, 2, 3), new Set(3, 2, 1))` to return `true`, especially if you're just asserting what the set has, but most algorithms out there return `false` for this.
