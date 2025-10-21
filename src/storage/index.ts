import { idb } from "@/wrappers";

type TDefineStorage = Array<{
  collection: string,
  keyPath: string;
  autoIncrement: boolean;
}>


export function defineStorage(collections: TDefineStorage) {
  const collectionMap = new Map(
    collections.map(({ collection, keyPath, autoIncrement }) => {
      if (!collection?.trim()) throw new Error('[❌]: Collection name cannot be empty.');
      return [collection, { keyPath, autoIncrement }];
    })
  );

  return {
    collection: (name: string) => {
      if (!name?.trim()) throw new Error('[❌]: Collection name must be a non-empty string.');

      const config = collectionMap.get(name);

      if (!config) {
        const available = Array.from(collectionMap.keys()).join(', ');
        throw new Error(`[❌]: Collection '${name}' not found. Available: ${available}`);
      }

      return idb({
        storage: name,
        ...config
      });
    }
  }
}



// export function initStorage<T, K extends string>(collections: Array<TCollection<T, K>>): IStorageInstance<typeof collections> {
//   const collsMap = new Map(collections.map(coll => [coll.schema, coll]))

//   return {
//     collection: (name) => {
//       const $idb = idb({ storage: name })
//       const collContext = collsMap.get(name)

//       return {
//         isUndefined() {
//           return !collContext
//         },
//         isEmpty: function () {
//           if (!collContext || this.isUndefined()) {
//             return true;
//           }

//           return (collContext.documents.length ?? 0) === 0
//         },
//         find: function (key, value) {
//           if (this.isEmpty()) {
//             return undefined
//           }

//           return collContext?.documents?.find(x => x[key] === value)
//         },
//         findAsync: async function (key, value) {
//           return new Promise((resolve, _reject) => {
//             if (!collContext || this.isEmpty()) {
//               return resolve(undefined)
//             }

//             for (const document of collContext.documents) {
//               if (document[key] === value) {
//                 return resolve(document)
//               }
//             }
//           })
//         }
//       }
//     },
//   }
// }
