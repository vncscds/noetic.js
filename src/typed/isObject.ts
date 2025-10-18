import isType from "./isType";

export default function isObject(target: unknown): target is Record<PropertyKey, unknown> {
  return isType(target, 'object')
}