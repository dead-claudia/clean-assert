[![Build Status](https://travis-ci.org/isiahmeadows/clean-assert-util.svg?branch=master)](https://travis-ci.org/isiahmeadows/cclean-assert-util)

# clean-assert-util

Common utilities for [`clean-assert`](https://www.npmjs.com/package/clean-assert), separated for better stability and easier use, so you can create your own assertions and still make them just as clean, neat, and native-looking as any of `clean-assert`'s own assertion methods. No more of this:

```js
assert(something.isntRight(), "Something isn't right")
// AssertionError: Something isn't right
```

Instead, this could look like this, with beautiful error messages to match:

```js
if (something.isntRight()) {
    assertUtil.fail("Something isn't right: expected {expected}, found {actual}", {
        expected: good,
        actual: bad,
    })
}
// AssertionError: Something isn't right: expected 1, found 2
```

## Installation

Install via [npm](https://www.npmjs.com/package/clean-assert-util):

```
npm install --save clean-assert-util
```

## API

Just the basics, a common, non-volatile core.

### assertUtil.inspect(object, ...opts?)

```js
assertUtil.inspect(object, ...opts)
```

An alias of Node's `util.inspect`, but resolved to use `util-inspect` in browsers. Much easier than using `util.inspect` directly, with less excess in the bundle.

### class assertUtil.AssertionError

```js
new assertUtil.AssertionError(message="", expected=undefined, actual=undefined)
```

The assertion error constructor used in this assertion library. Don't worry, it's only used here, and the rest of Thallium really doesn't care what assertion library you use, if any. It simply checks for the error's `name` to be `"AssertionError"`, nothing else.

### assertUtil.assert(condition, message?)

```js
assertUtil.assert(condition, message="")
```

The basic assert method. Most assertion libraries have some variant of this: test a `condition`, and if it's falsy, throw an assertion error with a `message`.

### assertUtil.fail(message?)

```js
assertUtil.fail(message="")
```

The basic automatic failure method. Most assertion libraries have some variant of this: throw an assertion error with a `message`.

### assertUtil.format(message, args, formatter?)

```js
assertUtil.format(message, args, prettify=util.inspect)
```

Create a formatted message from the template `message`, using `args` to fill it in and `prettify` to pretty-print it to a string.

### assertUtil.fail(message, args, formatter?)

```js
assertUtil.fail(message, args, prettify=util.inspect)
```

Throw a formatted assertion error, formatted with `assertUtil.format`, and with `args.expected` and `args.actual` being passed directly to the `assertUtil.AssertionError` constructor.

### assertUtil.escape(string)

```js
assertUtil.escape(string)
```

Escape a string so that `assertUtil.format` returns the raw string instead of "pretty-printing" it (e.g. for function names injected into templates).

## License

Copyright (c) 2016 and later, Isiah Meadows <me@isiahmeadows.com>.

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
