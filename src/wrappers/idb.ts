import isArray from "@/typed/isArray";
import isObject from "@/typed/isObject";
import getTypeTag from "@/utils/getTypeTag";

type TWrapperIDBParams = {
  storage: string;
  idbVersion?: number;
  keyPath?: string;
  autoIncrement?: boolean;
}

enum IDBModes {
  WRITE = 'readwrite',
  READ = 'readonly',
}

const DEFAULT_STORAGE_NAME = 'storage';
const DEFAULT_IDB_VERSION = 1;
const DEFAULT_KEY_PATH = 'id';
const DEFAULT_AUTO_INCREMENT = false

const $dbCache = new Map<string, Promise<IDBDatabase>>();

export function idb({ storage = DEFAULT_STORAGE_NAME, idbVersion = DEFAULT_IDB_VERSION, autoIncrement = DEFAULT_AUTO_INCREMENT, keyPath = DEFAULT_KEY_PATH }: TWrapperIDBParams) {
  if (!$dbCache.has(storage)) {
    $dbCache.set(storage, initIDB(storage, idbVersion));
  }

  const $idb = $dbCache.get(storage);

  function initIDB(storageName: string, version: number): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const dbRequest = indexedDB.open(storageName, version);

      dbRequest.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
        const db = (ev.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(storageName)) {
          db.createObjectStore(storageName, { keyPath, autoIncrement });
        }
      };

      dbRequest.onsuccess = (ev: Event) => {
        const db = (ev.target as IDBOpenDBRequest).result;

        db.onversionchange = () => {
          db.close();
          $dbCache.delete(storageName);
          console.warn(`[⚠️]: Database '${storageName}' closed due to version change`);
        };

        console.log(`[✅]: Loaded '${storageName}' object store.`);
        resolve(db);
      };

      dbRequest.onerror = (ev: Event) => {
        const error = (ev.target as IDBOpenDBRequest).error;
        $dbCache.delete(storageName);
        reject(new Error(`[❌]: Failed to open IndexedDB '${storageName}': ${error?.message || 'Unknown error'}`));
      };

      dbRequest.onblocked = () => {
        console.warn(`[⚠️]: Database '${storageName}' opening blocked. Close other tabs.`);
      };
    });
  }

  const $eq = async (key: string, value: unknown, limit: number = Number.MAX_SAFE_INTEGER) => {
    const $db = await $idb as IDBDatabase;

    return new Promise<unknown[]>((resolve, reject) => {
      const transaction = $db.transaction([storage], 'readonly');
      const objectStore = transaction.objectStore(storage);

      const req = objectStore.openCursor(null, 'next');
      const results: Array<unknown> = [];

      req.onsuccess = () => {
        const cursor = req.result as IDBCursorWithValue;

        if (results.length === limit) {
          resolve(results)
          return;
        }

        if (!cursor) {
          resolve(results)
          return
        }

        const target = typeof cursor.value !== 'undefined' ? cursor.value : {}

        if (key in target && target[key] === value) {
          results.push(target);
          cursor.continue();
          return
        }

        cursor.continue();
      };

      req.onerror = () => {
        reject(new Error(
          `[❌] Failed to open cursor:\n` +
          `Reason: ${req.error?.message || 'Unknown error'}`
        ));
      };
    })
  }

  const $notEq = async (key: string, value: unknown, limit: number = Number.MAX_SAFE_INTEGER) => {
    const $db = await $idb as IDBDatabase;

    return new Promise<unknown[]>((resolve, reject) => {
      const transaction = $db.transaction([storage], 'readonly');
      const objectStore = transaction.objectStore(storage);

      const req = objectStore.openCursor(null, 'next');
      const results: Array<unknown> = [];

      req.onsuccess = () => {
        const cursor = req.result as IDBCursorWithValue;

        if (results.length === limit) {
          resolve(results)
          return;
        }

        if (!cursor) {
          resolve(results)
          return
        }

        const target = typeof cursor.value !== 'undefined' ? cursor.value : {}

        if (key in target && target[key] !== value) {
          results.push(target)
          cursor.continue()
          return;
        }

        cursor.continue();
      };

      req.onerror = () => {
        reject(new Error(
          `[❌] Failed to open cursor:\n` +
          `Reason: ${req.error?.message || 'Unknown error'}`
        ));
      };
    })
  }

  const $update =

  return {
    __db: $idb,
    __name: storage,
    __version: DEFAULT_IDB_VERSION,
    insertOne: async <T extends Record<PropertyKey, unknown>>(data: T) => {
      if (!isObject(data)) {
        const errMessage = `[❌]: Failed to insert into ${storage}\n` +
          `Required: A single object such as "${JSON.stringify({ key: 'value' })}"\n` +
          `Received: "${getTypeTag(data)}"`

        if (isArray(data)) {
          throw new TypeError(
            `${errMessage}\n` +
            `[❌]: To insert multiple values, use <$idb>.insertMany() method instead`
          )
        }
      }

      const db = await $idb as IDBDatabase

      return new Promise((resolve, reject) => {
        const transaction = db?.transaction([storage], IDBModes.WRITE)
        const objectStore = transaction?.objectStore(storage)

        if (objectStore.keyPath && !objectStore.autoIncrement) {
          const keyPathArr = isArray(objectStore.keyPath)
            ? objectStore.keyPath
            : [objectStore.keyPath]

          const hasRequiredKey = keyPathArr.some(key => key in data);

          if (!hasRequiredKey) {
            const missingKeys = keyPathArr.filter(k => !(k in data));

            reject(new Error(
              `[❌] Cannot insert into "${storage}": Missing required keyPath.\n` +
              `Required (at least one): ${keyPathArr.map(k => `"${k}"`).join(', ')}\n` +
              `Missing: ${missingKeys.map(k => `"${k}"`).join(', ')}\n` +
              `Received data: ${JSON.stringify(data)}`
            ));

            return
          }
        }

        const req = objectStore.add(data)

        req.onsuccess = () => {
          console.log(`[✅]: Inserted into '${storage}':`, data);
          resolve({ item: data, key: req.result })
        }

        req.onerror = () => {
          reject(new Error(
            `[❌]: Failed to insert data into ${storage}:\n` +
            `Reason: "${req.error?.message || 'Reason not found.'}"\n` +
            `Received data: ${JSON.stringify(data)}`
          ));
        }

        transaction.onerror = () => {
          reject(new Error(
            `[❌]: Transaction failed for "${storage}": ${transaction.error?.message || 'Unknown error'}`
          ));
        };
      })
    },
    insertMany: async <T extends Record<PropertyKey, unknown>>(data: T[]) => {
      const db = await $idb as IDBDatabase

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storage], IDBModes.WRITE)
        const objectStore = transaction.objectStore(storage)

        if (objectStore.keyPath && !objectStore.autoIncrement) {
          const keyPathArr = isArray(objectStore.keyPath)
            ? objectStore.keyPath
            : [objectStore.keyPath];

          data.forEach(item => {
            if (!keyPathArr.some(key => key in item)) {
              const missingKeys = keyPathArr.filter(k => !(k in item));
              reject(new Error(
                `[❌] Cannot insert into "${storage}": Missing required keyPath.\n` +
                `Required (at least one): ${keyPathArr.map(k => `"${k}"`).join(', ')}\n` +
                `Missing: ${missingKeys.map(k => `"${k}"`).join(', ')}\n` +
                `Received data: ${JSON.stringify(data)}`
              ));

              transaction.abort()
              return;
            }
          })
        }

        const $insertionState: { insertedLen: number, items: T[] } = {
          insertedLen: 0,
          items: []
        }

        data.forEach((item, idx) => {
          const req = objectStore.add(item)

          req.onsuccess = () => {
            $insertionState.items.push(item)
            $insertionState.insertedLen = $insertionState.insertedLen + 1

            if ($insertionState.insertedLen === data.length) {
              console.log(`[✅] Inserted ${data.length} items into "${storage}"`);
              resolve($insertionState);
            }
          }

          req.onerror = () => {
            reject(new Error(
              `[❌] Failed to insert ${idx + 1} item of ${data.length} into "${storage}":\n` +
              `Reason: ${req.error?.message || 'Unknown error'}\n` +
              `Data: ${JSON.stringify(item)}`
            ));
          }
        })
      })
    },
    getAll: <T extends { limit: number } | undefined = undefined>(options?: T): T extends undefined ? Promise<unknown[]> & { limit: (limit: number) => Promise<unknown[]>; } : Promise<T[]> => {
      const $getAll = async (limit?: number): Promise<unknown[]> => {
        const db = await $idb as IDBDatabase;

        const transaction = db.transaction([storage], IDBModes.READ);
        const objectStore = transaction.objectStore(storage);

        return new Promise<T[]>((resolve, reject) => {
          const req = objectStore.getAll(null, Number.isNaN(limit) ? undefined : limit);

          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(
            new Error(
              `[❌] Failed to read data from ${storage}:\n` +
              `Reason: ${req.error?.message || 'Unknown error'}`
            )
          );
        });
      };

      if (options !== undefined) {
        const limit = typeof options === 'number' ? options : options.limit;
        return $getAll(limit) as any satisfies Promise<unknown[]>
      }

      const $promise = $getAll() as Promise<unknown[]> & { limit: (n: number) => Promise<unknown[]> }
      $promise.limit = (limit: number) => $getAll(limit)
      return $promise as any satisfies Promise<unknown[]> & { limit: (n: number) => Promise<unknown[]> }
    },
    query: () => {
      return {
        findMany: () => {
          return {
            where: (key: string) => {
              return {
                eq: (value: unknown) => {
                  return $eq(key, value)
                },
                notEq: (value: unknown) => {
                  return $notEq(key, value)
                }
              }
            }
          }
        },
        findOne: () => {
          return {
            where: (key: string) => {
              return {
                eq: async (value: unknown) => {
                  return (await $eq(key, value, 1))[0]
                },
                notEq: async (value: unknown) => {
                  return (await $notEq(key, value, 1))[0]
                }
              };
            }
          }
        }
      }
    },
    update: () => {
      return {
        many: function () {
          return this.updateMany
        },
        updateMany: () => {
          return {
            where: (key: string) => {
              return {
                eq: (value: unknown) => {
                  return $eq(key, value)
                },
                notEq: (value: unknown) => {
                  return $notEq(key, value)
                }
              }
            }
          }
        },
        one: function (oldData: Record<PropertyKey, unknown>, newData: Record<PropertyKey, unknown>) {
          return this.singleOne(oldData, newData)
        },
        updateOne: function (oldData: Record<PropertyKey, unknown>, newData: Record<PropertyKey, unknown>) {
          return this.singleOne(oldData, newData)
        },
        singleOne: async (oldData: Record<PropertyKey, unknown>, newData: Record<PropertyKey, unknown>) => {
          const db = await $idb as IDBDatabase;
          return new Promise<{ old: Record<PropertyKey, unknown>, new: Record<PropertyKey, unknown> } | null>((resolve, reject) => {
            const transaction = db.transaction([storage], IDBModes.WRITE)
            const objectStore = transaction.objectStore(storage)

            const req = objectStore.openCursor()

            req.onsuccess = () => {
              const cursor = req.result as IDBCursorWithValue

              if (!cursor) {
                resolve(null)
                return;
              }

              const target = cursor.value
              const dataMatch = Object.entries(oldData).every(([k, v]) => k in target && target[k] === v)

              if (!dataMatch) {
                cursor.continue();
                return;
              }

              const data = { ...target, ...newData }
              cursor.update(data);
              resolve({ old: target, new: data })
              return;
            }
          })
        },
      }
    }
  }
}