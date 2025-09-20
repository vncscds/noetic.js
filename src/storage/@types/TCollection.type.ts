/**
 * Defines the base structure for a collection.
 * T -> The document type (e.g., Movie).
 * K -> The literal type of the schema (e.g., 'movies').
 */
export type TCollection<T = Record<string, unknown>, K extends string = string> = {
  schema: K;
  documents: Array<T>
}
