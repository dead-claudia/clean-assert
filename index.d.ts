/* tslint:disable */

export type ObjectMap = {[key: string]: any} | {[key: number]: any};
export function assert(condition: any, message?: string): void;

export class AssertionError extends Error {
    name: "AssertionError";
    message: string;
    expected: any;
    actual: any;
    constructor(message?: string, expected?: any, actual?: any);
}

export function format(message: string, args: ObjectMap, prettify?: (value: any) => string): string;
export function escape(message: string): string;
export function fail(message: string): void;
export function fail(message: string, args: ObjectMap, prettify?: (value: any) => string): void;
