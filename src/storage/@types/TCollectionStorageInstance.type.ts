
export declare type TCollectionStorageInstance<T = unknown> = {
  isUndefined: () => boolean;
  isEmpty: () => boolean;
  find<K extends keyof T>(key: K, value: unknown): T | undefined,
  findAsync<K extends keyof T>(key: K, value: unknown): Promise<T | undefined>,
}
