import type { IStorageInstance, TCollection } from "./@types";

export function getStorage<T, K extends string>(collections: Array<TCollection<T, K>>): IStorageInstance<typeof collections> {
  const collsMap = new Map(collections.map(coll => [coll.schema, coll]))

  return {
    collection: (name) => {
      const collContext = collsMap.get(name)

      return {
        isUndefined() {
          return !collContext
        },
        isEmpty: function () {
          if (!collContext || this.isUndefined()) {
            return true;
          }

          return (collContext.documents.length ?? 0) === 0
        },
        find: function (key, value) {
          if (this.isEmpty()) {
            return undefined
          }

          return collContext?.documents?.find(x => x[key] === value)
        },
        findAsync: async function (key, value) {
          return new Promise((resolve, _reject) => {
            if (!collContext || this.isEmpty()) {
              return resolve(undefined)
            }

            for (const document of collContext.documents) {
              if (document[key] === value) {
                return resolve(document)
              }
            }
          })
        }
      }
    },
  }
}