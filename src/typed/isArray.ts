import isType from "./isType";

export default function isArray(target: unknown): target is Array<unknown> {
  return isType(target, 'array')
}