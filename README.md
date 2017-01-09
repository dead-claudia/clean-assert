# clean-match

A simple, fast, zero-dependency, ES2015+ aware deep matching utility, with support for ES5 environments. Tested in Node 4+ and PhantomJS 2.

## Installation

Install via [npm](https://www.npmjs.com/package/clean-match):

```
npm install --save clean-match
```

And some basic usage in Node or Browserify:

```js
var match = require("clean-match")
var foo = {a: 1, b: 2}

if (match.loose(foo, {a: 1, b: 2})) {
    console.log("It matched!")
}
```

You may also use it in the browser:

```html
<script src="./node_modules/clean-match/clean-match.js"></script>
<script>
var foo = {a: 1, b: 2}

if (match.loose(foo, {a: 1, b: 2})) {
    alert("It matched!")
}
</script>
```

It's also usable as an AMD module:

```js
define(["clean-match"], function (match) {
    var foo = {a: 1, b: 2}

    if (match.loose(foo, {a: 1, b: 2})) {
        console.log("It matched!")
    }    
})
```

## API

```js
match.loose(a, b)
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

```js
match.strict(a, b)
```

Compare two values, either primitives or objects, structurally, but also verify that their prototypes match (and their children, recursively). The above notes for `match.loose` also apply, except that symbols are checked for identity instead.

## Why another deep equality algorithm?

There's many reasons:

1. It's not that uncommon just to want to assert that two values match without checking their types.
2. Most deep equality algorithms are slow, with Node's native `assert` and Lodash's `_.match` being the primary exceptions.
3. Most deep equality algorithms aren't ES6-aware, especially when maps and sets get into the picture.
4. Error stacks are practically useless when matching them. In addition, PhantomJS and IE both generate the stack *when the error is thrown*, not when it was created.
5. It's often helpful to match symbols, dates, and other value-like types for their value, not their identity.

## License

Copyright (c) 2016 and later, Isiah Meadows <me@isiahmeadows.com>.

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
