import type { TCollection } from "./TCollection.type";

/**
 * Extracts the union of all document types from a collections array.
 * Ex: Movie | User
 */
export type TCollectionDocuments<T extends ReadonlyArray<TCollection<unknown>> = ReadonlyArray<TCollection<unknown>>> = T[number] extends { documents: infer D }
  ? D extends ReadonlyArray<infer D>
  ? D
  : never
  : never