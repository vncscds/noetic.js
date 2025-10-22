import { idb } from "@/wrappers";


type TCollectionDefinition<T = string> = {
  collection: T,
  keyPath: string;
  autoIncrement: boolean;
}

type TDefineStorage<T = string> = Array<TCollectionDefinition<T>>

export function defineStorage<const T extends TDefineStorage>(collections: T) {
  type CollectionName = T extends TDefineStorage ? T[number]['collection'] : never;

  const collectionMap = new Map(
    collections.map(({ collection, keyPath, autoIncrement }) => {
      if (!collection?.trim()) throw new Error('[❌]: Collection name cannot be empty.');
      return [collection as CollectionName, { keyPath, autoIncrement }];
    })
  );

  return {
    __collections: collections,
    collectionsLength: collections.length,
    collection: (name: CollectionName) => {
      if (!name?.trim()) {
        throw new Error('[❌]: Collection name must be a non-empty string.');
      }

      const config = collectionMap.get(name);

      if (!config) {
        const available = Array.from(collectionMap.keys()).join(', ');
        throw new Error(`[❌]: Collection '${name}' not found. Available: ${available}`);
      }

      return idb({
        storage: name,
        ...config
      });
    },
  }
}