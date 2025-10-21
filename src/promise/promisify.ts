import isFunction from "@/typed/isFunction";

export function promisify(fn: (...args: unknown[]) => unknown) {
  if (!isFunction(fn)) {
    throw new TypeError('Expected a function as argument in "promisify" function (@promises/promisify).')
  }

  if (fn.length === 0) {
    throw new TypeError('"promisify" expected a function as argument.')
  }

}
