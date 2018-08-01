// TODO: Once TS 3.0 is released (and gets a bit more widespread), remove one
// of these slashes and enable this triple-slash directive.
//// <reference lib="es2015.iterable" />
/* tslint:disable */

declare global {
    // Shut up the type checker before the next TS version
    interface Iterable<T> {}
}

type Collectionish<T> = Iterable<T> | ArrayLike<T>

export interface FormatOptions {
    [key: string]: any;
}

export interface PrettifyOptions {
    depth: number;
}

export interface FormatPrettify {
    (value: any, options: PrettifyOptions): string;
}

export class AssertionError extends Error {
    name: "AssertionError";
    expected: any;
    actual: any;
    constructor(message?: string, expected?: any, actual?: any);
}

export function format(message: string, args: FormatOptions, prettify?: FormatPrettify): string;
export function escape(message: string): string;

/**
 * Perform a prototype-agnostic deep object match.
 */
export function matchLoose<T>(a: T, b: T): boolean;

/**
 * Perform a prototype-aware deep object match.
 */
export function matchStrict<T>(a: T, b: T): boolean;

export interface InspectOptions {
    showHidden?: boolean;
    depth?: number;
    colors?: boolean;
    customInspect?: boolean;
}

export interface InspectStyles {
    special: string;
    number: string;
    boolean: string;
    undefined: string;
    null: string;
    string: string;
    symbol: string;
    date: string;
    regexp: string;
}

// Note: this delegates to either `util-inspect` or Node's native
// `util.inspect`, based on the environment.
export const inspect: {
    (object: any, options?: InspectOptions): string;
    /** @deprecated in favor of the options object version */
    (object: any, showHidden?: boolean, depth?: boolean, colors?: boolean): string;
    colors: {[key: string]: [number, number]};
    styles: InspectStyles;
};

// And now, for all the assertions.

export function assert(condition: boolean, message?: string, actual?: any, expected?: any): void;
export function fail(message: string, actual?: any, expected?: any): void;
export function failFormat(message: string, args: FormatOptions, prettify?: FormatPrettify): void;

export interface SetLike<T> { has(value: T): boolean; }
export interface MapLike<T, U> extends SetLike<T> { get(value: T): U; }

// Type tests

export function ok(value: any): void;
export function notOk(value: any): void;

// `undefined` is omitted because it's impossible for it to check. If you really
// mean to use it, just use `assert.equal(value, undefined)`.
type AssertType =
    | "array" | "array-like" | "bigint" | "boolean" | "function" | "iterable"
    | "number" | "object" | "reference" | "string" | "symbol"
    | (new (...args: any[]) => any)

export function is(Type: AssertType, value: any): void;
export function not(Type: AssertType, value: any): void;
export function possibly(Type: AssertType, value: any): void;
export function notPossibly(Type: AssertType, value: any): void;

// Numeric tests

export function atLeast(n: number, limit: number): void;
export function atMost(n: number, limit: number): void;
export function above(n: number, limit: number): void;
export function below(n: number, limit: number): void;

export function between(n: number, lower: number, upper: number): void;
export function notBetween(n: number, lower: number, upper: number): void;

export function closeTo(actual: number, expected: number, epsilon?: number): void;
export function notCloseTo(actual: number, expected: number, epsilon?: number): void;

// Exception testing

export function throws(Type: AssertType, func: () => any): void;

export function throwsMatching(
    matcher: ((error: Error) => boolean) | string | RegExp | object,
    func: () => any
): void;

// Key existence in object/set/map

export function hasOwn<T extends object>(object: T, key: keyof T): void;
export function lacksOwn<T extends object>(object: T, key: keyof T): void;

export function hasIn<T extends object>(object: T, key: keyof T): void;
export function lacksIn<T extends object>(object: T, key: keyof T): void;

export function hasKey<T>(object: SetLike<T>, key: T): void;
export function lacksKey<T>(object: SetLike<T>, key: T): void;

// Value/property structural equality

export function equal<T>(actual: T, expected: T): void;
export function notEqual<T>(actual: T, expected: T): void;

export function equalsAny<T>(actual: T, expected: Collectionish<T>): void;
export function equalsNone<T>(actual: T, expected: Collectionish<T>): void;

export function hasOwn<T extends object>(object: T, key: keyof T, value: T[typeof key]): void;
export function lacksOwn<T extends object>(object: T, key: keyof T, value: T[typeof key]): void;

export function hasIn<T extends object>(object: T, key: keyof T, value: T[typeof key]): void;
export function lacksIn<T extends object>(object: T, key: keyof T, value: T[typeof key]): void;

export function hasKey<T, U>(object: MapLike<T, U>, key: T, value: U): void;
export function lacksKey<T, U>(object: MapLike<T, U>, key: T, value: U): void;

// Structural existence in collection

export function includes<T>(coll: Collectionish<T>, value: T): void;
export function excludes<T>(coll: Collectionish<T>, value: T): void;

export function includesAll<T>(coll: Collectionish<T>, values: Collectionish<T>): void;
export function excludesAll<T>(coll: Collectionish<T>, values: Collectionish<T>): void;

export function includesAny<T>(coll: Collectionish<T>, values: Collectionish<T>): void;
export function excludesAny<T>(coll: Collectionish<T>, values: Collectionish<T>): void;

// Multiple keys' structural existence in object

export function hasAllOwn<T extends object>(object: T, keys: Collectionish<keyof T>): void;
export function lacksAllOwn<T extends object>(object: T, keys: Collectionish<keyof T>): void;

export function hasAnyOwn<T extends object>(object: T, keys: Collectionish<keyof T>): void;
export function lacksAnyOwn<T extends object>(object: T, keys: Collectionish<keyof T>): void;

export function hasAllIn<T extends object>(object: T, keys: Collectionish<keyof T>): void;
export function lacksAllIn<T extends object>(object: T, keys: Collectionish<keyof T>): void;

export function hasAnyIn<T extends object>(object: T, keys: Collectionish<keyof T>): void;
export function lacksAnyIn<T extends object>(object: T, keys: Collectionish<keyof T>): void;

export function hasAllKeys<T>(object: SetLike<T>, keys: Collectionish<T>): void;
export function lacksAllKeys<T>(object: SetLike<T>, keys: Collectionish<T>): void;

export function hasAnyKey<T>(object: SetLike<T>, keys: Collectionish<T>): void;
export function lacksAnyKey<T>(object: SetLike<T>, keys: Collectionish<T>): void;

// Multiple values' structural existence in object

export function hasAllOwn<T extends object>(object: T, keys: Partial<T>): void;
export function lacksAllOwn<T extends object>(object: T, keys: Partial<T>): void;

export function hasAnyOwn<T extends object>(object: T, keys: Partial<T>): void;
export function lacksAnyOwn<T extends object>(object: T, keys: Partial<T>): void;

export function hasAllIn<T extends object>(object: T, keys: Partial<T>): void;
export function lacksAllIn<T extends object>(object: T, keys: Partial<T>): void;

export function hasAnyIn<T extends object>(object: T, keys: Partial<T>): void;
export function lacksAnyIn<T extends object>(object: T, keys: Partial<T>): void;

export function hasAllKeys<K extends string | symbol, V>(object: MapLike<K, V>, keys: {[P in K]: V}): void;
export function lacksAllKeys<K extends string | symbol, V>(object: MapLike<K, V>, keys: {[P in K]: V}): void;

export function hasAnyKey<K extends string | symbol, V>(object: MapLike<K, V>, keys: {[P in K]: V}): void;
export function lacksAnyKey<K extends string | symbol, V>(object: MapLike<K, V>, keys: {[P in K]: V}): void;

// Value/property exact equality

export function exactlyEqual<T>(actual: T, expected: T): void;
export function exactlyNotEqual<T>(actual: T, expected: T): void;

export function exactlyEqualsAny<T>(actual: T, expected: Collectionish<T>): void;
export function exactlyEqualsNone<T>(actual: T, expected: Collectionish<T>): void;

export function exactlyHasOwn<T extends object>(object: T, key: keyof T, value: T[typeof key]): void;
export function exactlyLacksOwn<T extends object>(object: T, key: keyof T, value: T[typeof key]): void;

export function exactlyHasIn<T extends object>(object: T, key: keyof T, value: T[typeof key]): void;
export function exactlyLacksIn<T extends object>(object: T, key: keyof T, value: T[typeof key]): void;

export function exactlyHasKey<T, U>(object: MapLike<T, U>, key: T, value: U): void;
export function exactlyLacksKey<T, U>(object: MapLike<T, U>, key: T, value: U): void;

// Exact existence in collection

export function exactlyIncludes<T>(coll: Collectionish<T>, value: T): void;
export function exactlyExcludes<T>(coll: Collectionish<T>, value: T): void;

export function exactlyIncludesAll<T>(coll: Collectionish<T>, values: Collectionish<T>): void;
export function exactlyExcludesAll<T>(coll: Collectionish<T>, values: Collectionish<T>): void;

export function exactlyIncludesAny<T>(coll: Collectionish<T>, values: Collectionish<T>): void;
export function exactlyExcludesAny<T>(coll: Collectionish<T>, values: Collectionish<T>): void;

// Multiple keys' exact existence in object

export function exactlyHasAllIn<T extends object>(object: T, keys: Collectionish<keyof T>): void;
export function exactlyLacksAllIn<T extends object>(object: T, keys: Collectionish<keyof T>): void;

export function exactlyHasAnyIn<T extends object>(object: T, keys: Collectionish<keyof T>): void;
export function exactlyLacksAnyIn<T extends object>(object: T, keys: Collectionish<keyof T>): void;

export function exactlyHasAllOwn<T extends object>(object: T, keys: Collectionish<keyof T>): void;
export function exactlyLacksAllOwn<T extends object>(object: T, keys: Collectionish<keyof T>): void;

export function exactlyHasAnyOwn<T extends object>(object: T, keys: Collectionish<keyof T>): void;
export function exactlyLacksAnyOwn<T extends object>(object: T, keys: Collectionish<keyof T>): void;

export function exactlyHasAllKeys<K>(object: SetLike<K>, keys: Collectionish<K>): void;
export function exactlyLacksAllKeys<K>(object: SetLike<K>, keys: Collectionish<K>): void;

export function exactlyHasAnyKey<K>(object: SetLike<K>, keys: Collectionish<K>): void;
export function exactlyLacksAnyKey<K>(object: SetLike<K>, keys: Collectionish<K>): void;

// Multiple values' exact existence in object

export function exactlyHasAllIn<T>(object: T, keys: Partial<T>): void;
export function exactlyLacksAllIn<T>(object: T, keys: Partial<T>): void;

export function exactlyHasAnyIn<T>(object: T, keys: Partial<T>): void;
export function exactlyLacksAnyIn<T>(object: T, keys: Partial<T>): void;

export function exactlyHasAllOwn<T>(object: T, keys: Partial<T>): void;
export function exactlyLacksAllOwn<T>(object: T, keys: Partial<T>): void;

export function exactlyHasAnyOwn<T>(object: T, keys: Partial<T>): void;
export function exactlyLacksAnyOwn<T>(object: T, keys: Partial<T>): void;

export function exactlyHasAllKeys<K extends string | symbol, V>(object: MapLike<K, V>, keys: {[P in K]: V}): void;
export function exactlyLacksAllKeys<K extends string | symbol, V>(object: MapLike<K, V>, keys: {[P in K]: V}): void;

export function exactlyHasAnyKey<K extends string | symbol, V>(object: MapLike<K, V>, keys: {[P in K]: V}): void;
export function exactlyLacksAnyKey<K extends string | symbol, V>(object: MapLike<K, V>, keys: {[P in K]: V}): void;

// Value/property deep equality

export function deeplyEqual<T>(actual: T, expected: T): void;
export function deeplyNotEqual<T>(actual: T, expected: T): void;

export function deeplyEqualsAny<T>(actual: T, expected: Collectionish<T>): void;
export function deeplyEqualsNone<T>(actual: T, expected: Collectionish<T>): void;

export function deeplyHasOwn<T extends object>(object: T, key: keyof T, value: T[typeof key]): void;
export function deeplyLacksOwn<T extends object>(object: T, key: keyof T, value: T[typeof key]): void;

export function deeplyHasIn<T extends object>(object: T, key: keyof T, value: T[typeof key]): void;
export function deeplyLacksIn<T extends object>(object: T, key: keyof T, value: T[typeof key]): void;

export function deeplyHasKey<T, U>(object: MapLike<T, U>, key: T, value: U): void;
export function deeplyLacksKey<T, U>(object: MapLike<T, U>, key: T, value: U): void;

// Deep existence in collection

export function deeplyIncludes<T>(coll: Collectionish<T>, value: T): void;
export function deeplyExcludes<T>(coll: Collectionish<T>, value: T): void;

export function deeplyIncludesAll<T>(coll: Collectionish<T>, values: Collectionish<T>): void;
export function deeplyExcludesAll<T>(coll: Collectionish<T>, values: Collectionish<T>): void;

export function deeplyIncludesAny<T>(coll: Collectionish<T>, values: Collectionish<T>): void;
export function deeplyExcludesAny<T>(coll: Collectionish<T>, values: Collectionish<T>): void;

// Multiple keys' deep existence in object

export function deeplyHasAllIn<T extends object>(object: T, keys: Collectionish<keyof T>): void;
export function deeplyLacksAllIn<T extends object>(object: T, keys: Collectionish<keyof T>): void;

export function deeplyHasAnyIn<T extends object>(object: T, keys: Collectionish<keyof T>): void;
export function deeplyLacksAnyIn<T extends object>(object: T, keys: Collectionish<keyof T>): void;

export function deeplyHasAllOwn<T extends object>(object: T, keys: Collectionish<keyof T>): void;
export function deeplyLacksAllOwn<T extends object>(object: T, keys: Collectionish<keyof T>): void;

export function deeplyHasAnyOwn<T extends object>(object: T, keys: Collectionish<keyof T>): void;
export function deeplyLacksAnyOwn<T extends object>(object: T, keys: Collectionish<keyof T>): void;

export function deeplyHasAllKeys<K>(object: SetLike<K>, keys: Collectionish<K>): void;
export function deeplyLacksAllKeys<K>(object: SetLike<K>, keys: Collectionish<K>): void;

export function deeplyHasAnyKey<K>(object: SetLike<K>, keys: Collectionish<K>): void;
export function deeplyLacksAnyKey<K>(object: SetLike<K>, keys: Collectionish<K>): void;

// Multiple values' deep existence in object

export function deeplyHasAllIn<T>(object: T, keys: Partial<T>): void;
export function deeplyLacksAllIn<T>(object: T, keys: Partial<T>): void;

export function deeplyHasAnyIn<T>(object: T, keys: Partial<T>): void;
export function deeplyLacksAnyIn<T>(object: T, keys: Partial<T>): void;

export function deeplyHasAllOwn<T>(object: T, keys: Partial<T>): void;
export function deeplyLacksAllOwn<T>(object: T, keys: Partial<T>): void;

export function deeplyHasAnyOwn<T>(object: T, keys: Partial<T>): void;
export function deeplyLacksAnyOwn<T>(object: T, keys: Partial<T>): void;

export function deeplyHasAllKeys<K extends string | symbol, V>(object: MapLike<K, V>, keys: {[P in K]: V}): void;
export function deeplyLacksAllKeys<K extends string | symbol, V>(object: MapLike<K, V>, keys: {[P in K]: V}): void;

export function deeplyHasAnyKey<K extends string | symbol, V>(object: MapLike<K, V>, keys: {[P in K]: V}): void;
export function deeplyLacksAnyKey<K extends string | symbol, V>(object: MapLike<K, V>, keys: {[P in K]: V}): void;
