import type { TObject } from "./@types";

export function freeze<T extends TObject>(target: T): Readonly<T> {
  if (typeof Object.freeze !== 'undefined') {
    return Object.freeze(target)
  }

  const targetFrozen = {} as Readonly<T>

  for (const key in target) {
    Object.defineProperty(targetFrozen, key, {
      value: target[key],
      enumerable: true,
      writable: false,
      configurable: false,
    })
  }

  return targetFrozen;
}