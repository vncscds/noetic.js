import isObject from "./isObject";

/**
 * Checks if a value is a "Plain Old JavaScript Object" (POJO).
 *
 * This check excludes arrays, class instances, `null`, and built-in
 * objects like `Math` or `JSON`.
 *
 * @param {unknown} target - The value to check.
 * @returns {target is Record<PropertyKey, unknown>} Returns `true` if the target is a POJO, otherwise `false`.
 *
 * @example
 * isPOJO({}); // true
 * isPOJO({ a: 1 }); // true
 * isPOJO(Object.create(null)); // true
 *
 * isPOJO([]); // false
 * isPOJO(new Map()); // false
 * isPOJO(new class MyClass {}); // false
 * isPOJO(null); // false
 * isPOJO(undefined); // false
 * isPOJO(() => {}); // false
 */
export default function isPOJO(target: unknown): target is Record<PropertyKey, unknown> {
  if (!isObject(target)) return false;
  const targetProto = Object.getPrototypeOf(target);
  return targetProto === null || targetProto === Object.prototype
}