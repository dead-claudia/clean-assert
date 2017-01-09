[![Build Status](https://travis-ci.org/isiahmeadows/clean-assert.svg?branch=master)](https://travis-ci.org/isiahmeadows/cclean-assert)

# clean-assert

A simple TDD assertion library, initially designed for [Thallium](https://www.npmjs.com/package/thallium), but factored out as a separate module for use elsewhere. It's also modular, with its core factored out into [`clean-assert-util`](https://www.npmjs.com/package/clean-assert-util) so you can write your own assertions that look just like this one, without any hassle and without declaring a direct dependency on this (that package is much more stable).

## Installation

Install via [npm](https://www.npmjs.com/package/clean-assert):

```
npm install --save clean-assert
```

## API

See [here](https://github.com/isiahmeadows/clean-assert/blob/master/API.md).

## Examples

See the [tests](https://github.com/isiahmeadows/clean-assert/tree/master/tests). This assertion framework uses itself to test.

## Contributing

Found a bug? Want a feature? Report it [here](https://github.com/isiahmeadows/clean-assert/issues/new)! Want to contribute? Keep reading.

[ESLint](https://eslint.org) with [my preset](https://github.com/isiahmeadows/eslint-config-isiahmeadows) is used to lint, and [Mocha](https://mochajs.org) is used to run the tests. Most of the source code is in `lib/`, and the tests are all in `test/`.

The implementation is generally composed of a combination of DSLs to avoid a large amount of repetition, since most of the assertions fit the mold of "type check, test something, then throw an error if it failed".

## License

Copyright (c) 2016 and later, Isiah Meadows <me@isiahmeadows.com>.

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
