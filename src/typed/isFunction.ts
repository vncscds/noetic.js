import isType from "./isType"

/**
 * Checks if a value is a function.
 *
 * @param target - The value to check
 * @returns True if the value is a function, false otherwise
 *
 * @example
 * ```typescript
 * isFunction(() => {})           // true
 * isFunction(function() {})      // true
 * isFunction(async () => {})     // true
 * isFunction(function* gen() {}) // true
 * isFunction(class MyClass {})   // true
 *
 * isFunction({})                 // false
 * isFunction(null)               // false
 * isFunction(undefined)          // false
 * ```
 */
export default function isFunction(target: unknown): target is Function {
  return isType(target, 'function')
}