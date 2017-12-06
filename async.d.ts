/* tslint:disable */
import {AssertionError, Key, ObjectMap, MapLike, Matcher} from "./index";

type Async<T> = T | Promise<T>;

export function ok(value: any): Promise<void>;
export function notOk(value: any): Promise<void>;

export function isBoolean(object: any): Promise<void>;
export function notBoolean(object: any): Promise<void>;

export function isFunction(object: any): Promise<void>;
export function notFunction(object: any): Promise<void>;

export function isNumber(object: any): Promise<void>;
export function notNumber(object: any): Promise<void>;

export function isObject(object: any): Promise<void>;
export function notObject(object: any): Promise<void>;

export function isString(object: any): Promise<void>;
export function notString(object: any): Promise<void>;

export function isSymbol(object: any): Promise<void>;
export function notSymbol(object: any): Promise<void>;

export function exists(object: any): Promise<void>;
export function notExists(object: any): Promise<void>;

export function isArray(object: any): Promise<void>;
export function notArray(object: any): Promise<void>;

export function isIterable(object: any): Promise<void>;
export function notIterable(object: any): Promise<void>;

export function is(Type: new (...args: any[]) => any, object: any): Promise<void>;
export function not(Type: new (...args: any[]) => any, object: any): Promise<void>;

export function equal<T>(actual: Async<T>, expected: T): Promise<void>;
export function notEqual<T>(actual: Async<T>, expected: T): Promise<void>;

export function atLeast(n: Async<number>, limit: number): Promise<void>;
export function atMost(n: Async<number>, limit: number): Promise<void>;
export function above(n: Async<number>, limit: number): Promise<void>;
export function below(n: Async<number>, limit: number): Promise<void>;
export function between(n: Async<number>, lower: number, upper: number): Promise<void>;

export function equalLoose(actual: any, expected: any): Promise<void>;
export function notEqualLoose(actual: any, expected: any): Promise<void>;

// Strict deep equality, checking prototypes as well
export function deepEqual<T>(actual: Async<T>, expected: T): Promise<void>;
export function notDeepEqual<T>(actual: Async<T>, expected: T): Promise<void>;

// Purely structural deep equality
export function match<T>(actual: Async<T>, expected: T): Promise<void>;
export function notMatch<T>(actual: Async<T>, expected: T): Promise<void>;

// has own property, possibly equal to a value
export function hasOwn(object: Async<Object>, key: Key): Promise<void>;
export function notHasOwn(object: Async<Object>, key: Key): Promise<void>;

export function hasOwn(object: Async<Object>, key: Key, value: any): Promise<void>;
export function notHasOwn(object: Async<Object>, key: Key, value: any): Promise<void>;
export function hasOwnLoose(object: Async<Object>, key: Key, value: any): Promise<void>;
export function notHasOwnLoose(object: Async<Object>, key: Key, value: any): Promise<void>;

// has own or inherited property, possibly equal to a value
export function hasKey(object: Async<Object>, key: Key): Promise<void>;
export function notHasKey(object: Async<Object>, key: Key): Promise<void>;

export function hasKey(object: Async<Object>, key: Key, value: any): Promise<void>;
export function notHasKey(object: Async<Object>, key: Key, value: any): Promise<void>;
export function hasKeyLoose(object: Async<Object>, key: Key, value: any): Promise<void>;
export function notHasKeyLoose(object: Async<Object>, key: Key, value: any): Promise<void>;

export function has<T>(object: Async<MapLike<T, any>>, key: T): Promise<void>;
export function notHas<T>(object: Async<MapLike<T, any>>, key: T): Promise<void>;

export function has<T, U>(object: Async<MapLike<T, U>>, key: T, value: U): Promise<void>;
export function notHas<T, U>(object: Async<MapLike<T, U>>, key: T, value: U): Promise<void>;
export function hasLoose<T, U>(object: Async<MapLike<T, U>>, key: T, value: U): Promise<void>;
export function notHasLoose<T, U>(object: Async<MapLike<T, U>>, key: T, value: U): Promise<void>;

// throws, possibly of a specified type
export function throws(func: () => any): Promise<void>;
export function throws(Type: new (...args: any[]) => any, func: () => any): Promise<void>;

export function throwsMatch(matcher: Matcher, func: () => any): Promise<void>;

// Note: these two always fail with NaNs, and the delta ignores sign.
export function closeTo(actual: Async<number>, expected: number, epsilon?: number): Promise<void>;
export function notCloseTo(actual: Async<number>, expected: number, epsilon?: number): Promise<void>;

// includes list of values
// includes all
export function includes<T>(iter: Async<Iterable<T>>, values: T | Iterable<T>): Promise<void>;
export function includesDeep<T>(iter: Async<Iterable<T>>, values: T | Iterable<T>): Promise<void>;
export function includesMatch<T>(iter: Async<Iterable<T>>, values: T | Iterable<T>): Promise<void>;

// includes some
export function includesAny<T>(iter: Async<Iterable<T>>, values: Iterable<T>): Promise<void>;
export function includesDeepAny<T>(iter: Async<Iterable<T>>, values: Iterable<T>): Promise<void>;
export function includesMatchAny<T>(iter: Async<Iterable<T>>, values: Iterable<T>): Promise<void>;

// missing some
export function notIncludesAll<T>(iter: Async<Iterable<T>>, values: Iterable<T>): Promise<void>;
export function notIncludesDeepAll<T>(iter: Async<Iterable<T>>, values: Iterable<T>): Promise<void>;
export function notIncludesMatchAll<T>(iter: Async<Iterable<T>>, values: Iterable<T>): Promise<void>;

// missing all
export function notIncludes<T>(iter: Async<Iterable<T>>, values: Iterable<T>): Promise<void>;
export function notIncludesDeep<T>(iter: Async<Iterable<T>>, values: Iterable<T>): Promise<void>;
export function notIncludesMatch<T>(iter: Async<Iterable<T>>, values: Iterable<T>): Promise<void>;

// match Object.keys(object) with list of keys
export function hasKeys(object: Async<Object>, keys: Iterable<Key>): Promise<void>;
export function notHasKeysAll(object: Async<Object>, keys: Iterable<Key>): Promise<void>;
export function hasKeysAny(object: Async<Object>, keys: Iterable<Key>): Promise<void>;
export function notHasKeys(object: Async<Object>, keys: Iterable<Key>): Promise<void>;

// match Object.keys(object) with keys
// includes all
export function hasKeys(object: Async<Object>, keys: ObjectMap): Promise<void>;
export function hasKeysMatch(object: Async<Object>, keys: ObjectMap): Promise<void>;
export function hasKeysDeep(object: Async<Object>, keys: ObjectMap): Promise<void>;

// includes some
export function hasKeysAny(object: Async<Object>, keys: ObjectMap): Promise<void>;
export function hasKeysAnyDeep(object: Async<Object>, keys: ObjectMap): Promise<void>;
export function hasKeysAnyMatch(object: Async<Object>, keys: ObjectMap): Promise<void>;

// missing some
export function notHasKeysAll(object: Async<Object>, keys: ObjectMap): Promise<void>;
export function notHasKeysAllDeep(object: Async<Object>, keys: ObjectMap): Promise<void>;
export function notHasKeysAllMatch(object: Async<Object>, keys: ObjectMap): Promise<void>;

// missing all
export function notHasKeys(object: Async<Object>, keys: ObjectMap): Promise<void>;
export function notHasKeysMatch(object: Async<Object>, keys: ObjectMap): Promise<void>;
export function notHasKeysDeep(object: Async<Object>, keys: ObjectMap): Promise<void>;
