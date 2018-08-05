[![Build Status](https://travis-ci.org/isiahmeadows/clean-assert.svg?branch=master)](https://travis-ci.org/isiahmeadows/clean-assert) [![Join the chat at https://gitter.im/isiahmeadows/clean-assert](https://badges.gitter.im/isiahmeadows/clean-assert.svg)](https://gitter.im/isiahmeadows/clean-assert?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Clean Assert

A simple, intuitive, extensible, and open-core TDD assertion library.

- Very simple assertion-style syntax with intuitive names for each method.
- About 100 built-in assertions, all fitting a few very simple patterns.
- Custom assertions are simple functions that call `assert.assert` and friends. No, really.
- Optimized assertions and matching algorithms keep assertions fast.
- Very extensively tested - almost 4000 tests at the time of writing.
- Tested in both Node LTS, modern browsers, and even PhantomJS 2!

So what isn't there to love?

-----

*Note: If you're concerned about the very minimal Git/version history, this library is actively maintained, and I personally use this with all new production projects I control; it's just very stable and what you might consider mostly done. Probably one of those 0.00001% of projects that are generally bug-free.*

## Installation

Install via [npm](https://www.npmjs.com/package/clean-assert) or Yarn:

```
npm install --save-dev clean-assert
yarn add clean-assert
```

Or, if you just want to [try it out in a browser](https://flems.io/#0=N4IgNglgdg1gziAXAbVFAhgWwKZJAczAHsAjdMAOgCsEAaEAVwCcw8ALAFw4Ac5EB6fgyjcY+CgGMimfhLDZ0UALTo4cbEw79CpctTogOAT265EIGiAC+AXStA), add one of these `<script>` elements to your `<head>`:

```html
<!-- For the latest and greatest -->
<script src="https://unpkg.com/clean-assert/global.js"></script>

<!-- For version 3 -->
<script src="https://unpkg.com/clean-assert@3/global.js"></script>

<!-- If you prefer to use a local copy -->
<script src="./path/to/clean-assert/global.js"></script>
```

Note that if you use [Rollup](https://rollupjs.org/), this is exposed as a CommonJS module, not an ES module.

## API

See [here](https://github.com/isiahmeadows/clean-assert/blob/master/docs/README.md). There's not a lot in terms of examples, but the API docs are self-explanatory enough usage is pretty obvious.

## Motivation

This was originally designed for [Thallium](https://www.npmjs.com/package/thallium) when I first started working on that library, because I wanted something simple, yet intuitive, and something that didn't get in my way of testing crap. I apparently did a good enough job from the gate after decoupling it from that framework that I soon found it replacing [Chai](http://www.chaijs.com) for me in all new code I wrote.

I also experienced a few other issues with other libraries:

- An over-abundance of overly specific assertions like `assert.isTrue(value)` or `assert.lengthOf(value, 1)`, which add literally nothing at best to the user experience. In this, there's no `assert.isTrue(value)`, `assert.lengthOf(value, 1)` or other similarly niche methods. You just use `assert.equal(value, true)` or `assert.hasIn(value, "length", 1)`, respectively.
- An unnecessary reliance on identity for equality. If you read `assert.equal({foo: 1}, {foo: 1})`, you'd expect that to generally work if you're not thinking about strict equality semantics. In this, structural matching and value equality is the default, so `assert.equal({foo: 1}, {foo: 1})` works exactly how you'd expect it would.
- Plugins are extremely messy, complex, and suffer from name conflicts. In this, there's no such thing as a "plugin". Custom assertions just call `assert.assert`, `assert.fail`, or `assert.failFormat` once they're ready to test (in the first case) or fail (in the second).
- Most assertion libraries use a language that doesn't read like English, but instead some horribly bastardized, broken English-like pseudo-language that's trying to be somehow declarative when it's not. In this, it's all based on proper English and using imperative language - how you say it is almost always how the method is named. For a couple concrete examples:
    - This library's equivalent to [Chai's `assert.notDeepOwnInclude(object, "key")`](http://www.chaijs.com/api/assert/#method_notdeepowninclude) is `assert.deeplyHasOwn(object, "key")`.
    - This library's equivalent to [Chai's `assert.oneOf(value, list)`](http://www.chaijs.com/api/assert/#method_oneof) is `assert.equalsAny(actual, [...expected])`

## Contributing

Found a bug? Want a feature? Report it [here](https://github.com/isiahmeadows/clean-assert/issues/new)! Want to contribute? Keep reading.

[ESLint](https://eslint.org) with [my preset](https://github.com/isiahmeadows/eslint-config-isiahmeadows) is used to lint, and [Mocha](https://mochajs.org) is used to run the tests. Most of the source code is in `index.js` and `lib/`, and the tests are all in `test/`. There's various scripts and utilities in `scripts/`.

The implementation is generally composed of a combination of DSLs to avoid a large amount of repetition, since most of the assertions fit the mold of "type check, test something, then throw an error if it failed".

## License

Copyright (c) 2018 and later, Isiah Meadows <me@isiahmeadows.com>.

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
