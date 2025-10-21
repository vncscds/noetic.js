import isArray from "@/typed/isArray";

type TWrapperIDBParams = {
  storage: string;
  idbVersion?: number;
  keyPath?: string;
  autoIncrement?: boolean;
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

  return {
    __db: $idb,
    __version: DEFAULT_IDB_VERSION,
    insertOne: async <T extends Record<PropertyKey, unknown>>(data: T) => {
      const db = await $idb as IDBDatabase

      return new Promise((resolve, reject) => {
        const transaction = db?.transaction([storage], "readwrite")
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
            `Transaction failed for "${storage}": ${transaction.error?.message || 'Unknown error'}`
          ));
        };
      })
    },
  };
}