import type { TCollection } from "./TCollection.type";
import type { TCollectionDocuments } from "./TCollectionDocuments.type";
import type { TCollectionSchemasNames } from "./TCollectionSchemasNames.type";
import type { TCollectionStorageInstance } from "./TCollectionStorageInstance.type";

// interface IStorageInstance<K extends string = TCollectionSchemas<typeof collections>> {
//   collection: (name: K) => TCollectionStorageInstance;
// }

export interface IStorageInstance<T extends readonly TCollection<unknown>[]> {
  collection: (name: TCollectionSchemasNames<T>) => TCollectionStorageInstance<TCollectionDocuments<T>>;
}
