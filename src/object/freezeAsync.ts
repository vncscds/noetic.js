import type { TObject } from "./@types"
import { freeze } from "./freeze"

export function freezeAsync<T extends TObject>(target: T): Promise<Readonly<T>> {
  return new Promise((resolve, _reject) => {
    return resolve(freeze(target))
  })
}