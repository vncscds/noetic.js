/**
 * Extracts the union of all schema names from a collections array.
 * Ex: 'movies' | 'users'
 */
export type TCollectionSchemasNames<T extends ReadonlyArray<unknown> = ReadonlyArray<unknown>> = T[number] extends { schema: infer S } ? S : never;