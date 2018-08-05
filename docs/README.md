# Clean Assert API

```js
const assert = require("clean-assert")
```

Within Clean Assert, there are about 100 assertions, but they're all very much so related. Each of them exists for a particular use case, but even some of the seemingly obscure ones are themselves pretty useful.

- [Value checking](./value/README.md)
- [Type checking](./type.md)
- [Numeric comparison](./number.md)
- [Exception testing](./exception.md)
- [Key checking](./key.md)
- [Value inclusion](./include.md)
- [Utilities](./utility.md)

Since there's so many, it might seem like there's a lot to take in, but there's a pretty easy pattern to look at, where nearly all of them fit in - if you learn this, you can learn the library pretty quickly:

### Top level

Whether the assertion is the positive, negative, or other kind of form. Assertions fall into one of two categories here:

- `assert.assert`, `assert.fail`, and other similar assertions without inverses. These are pretty obvious just by looking at them. I will note that `assert.throws` and `assert.throwsMatching` don't have inverses because it's almost always easier to debug when you have the full stack trace on hand.
- Assertions like `assert.ok`/`assert.notOk` and `assert.is`/`assert.not` that have clear inverses. I tried to choose antonyms to contrast the positive with the negative where possible, preferring normal English over weird things like `assert.not.has.some.key` or whatever.

### Second level

The type of matching, whether structural, exact, or deep.

- Structural equality, such as with `assert.equal` and `assert.hasIn`. This uses `assert.matchLoose`, as explained below.
- Exact equality, such as with `assert.exactlyEqual` and `assert.exactlyHasIn`. This uses the [SameValueZero](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero) spec, which is basically your run of the mill `===` equality, but it also considers `NaN`s to be equal.
- Deep equality, such as with `assert.deeplyEqual` and `assert.deeplyHasIn`. This uses `assert.matchStrict`, as explained below.

These don't apply to everything - the type checking assertions are a good example here.

### Third level

What data is being matched.

- Equality, such as with `assert.equals(a, b)`
- Has own key, such as with `assert.hasOwn(object, key)`
- Has accessible key, such as with `assert.hasIn(object, key)`
- Has map/set key, such as with `assert.hasKey(object, key)`
- Has own key set to value, such as with `assert.hasOwn(object, key, value)`
- Has accessible key set to value, such as with `assert.hasIn(object, key, value)`
- Has map/set key set to value, such as with `assert.hasKey(object, key, value)`
- Includes a single value, such as with `assert.includes(iter, value)`

### Fourth level

How many possible values the data should match.

- Exactly one, such as with `assert.equals(a, b)` or `assert.includes(iter, value)`
- All of them, such as with `assert.includesAll(iter, [...values])`
- At least one, such as with `assert.equalsAny(a, [...values])` or `assert.includesAny(iter, [...values])`

Normally, most only have one value the data should match, but a few of the assertions can do multiple all at once, specifically `assert.includes` and both the key and key/value pair variants of `assert.hasOwn`, `assert.hasIn`, `assert.hasKey`, and `assert.includes`. Equality is a special case in that there is no "equals all" method, but there *is* an "equals any" method. (You *could* abuse `assert.includes` for this, but it's not recommended for readability and it makes diffs a little unnecessarily counter-intuitive.)
