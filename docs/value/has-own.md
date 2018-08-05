[*Up*](./README.md)

# Object own property equality

Sometimes, you want to check that one or more *own* properties exist in an object with a particular value. It's not always common, but here's a couple scenarios where you might want that behavior:

- You're creating and testing a polyfill.
- You're using objects with prototype delegation for something mimicking scoping.

For the second, one concrete example might be a simple "context" system for a view:

```js
var Context = (function () {
    var current = Object.freeze(Object.create(null))

    return {
        get current() { return current },
        set: function (keys, init) {
            var prev = this.current
            var next = Object.create(prev)
            for (var key in keys) {
                if ({}.hasOwnProperty.call(keys, key)) {
                    next[key] = keys[key]
                }
            }
            this.current = Object.freeze(next)
            try {
                init()
            } finally {
                this.current = prev
            }
        }
    }
})()
```

If you wanted to test whether a key was set in the most recent recursive call, that's what these assertions are for.

## Single key equality

```js
// Via `assert.matchLoose`
assert.hasOwn(object, key, expected)
assert.lacksOwn(object, key, expected)

// Via `assert.matchStrict`
assert.deeplyHasOwn(object, key, expected)
assert.deeplyLacksOwn(object, key, expected)

// Via SameValueZero
assert.exactlyHasOwn(object, key, expected)
assert.exactlyLacksOwn(object, key, expected)
```

Assert that an object has (or lacks) a single own property equal to `expected`. The use case is a bit more limited here compared to [`assert.hasIn`](./has-in.md), but it's here just in case you want it.

## Multiple keys' equality

```js
// Via `assert.matchLoose`
assert.hasAllOwn(object, {...pairs})
assert.lacksAllOwn(object, {...pairs})

// Via `assert.matchStrict`
assert.deeplyHasOwn(object, {...pairs})
assert.deeplyLacksOwn(object, {...pairs})

// Via SameValueZero
assert.exactlyHasOwn(object, {...pairs})
assert.exactlyLacksOwn(object, {...pairs})
```

Assert some object has (or lacks) as own properties all of a set of key/value pairs. This is useful for checking multiple properties at once without nearly as much boilerplate.

## One of many keys' equality

```js
// Via `assert.matchLoose`
assert.hasAnyOwn(object, {...pairs})
assert.lacksAnyOwn(object, {...pairs})

// Via `assert.matchStrict`
assert.deeplyHasAnyOwn(object, {...pairs})
assert.deeplyLacksAnyOwn(object, {...pairs})

// Via SameValueZero
assert.exactlyHasAnyOwn(object, {...pairs})
assert.exactlyLacksAnyOwn(object, {...pairs})
```

Assert some object has (or lacks) as own properties at least one of a set of key/value pairs. This is useful for checking multiple properties at once without nearly as much boilerplate, and it lets you avoid having to roll your own assertion just to do something obvious.
