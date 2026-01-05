// src/db/indexedDb.ts
import type { Store, Entry, Photo, Masters } from "../types";

const DB_NAME = "mei-store-counter";
const DB_VER = 1;

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req: IDBOpenDBRequest = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = () => {
      const db: IDBDatabase = req.result;
      if (!db.objectStoreNames.contains("stores")) {
        db.createObjectStore("stores", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("entries")) {
        db.createObjectStore("entries", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("photos")) {
        db.createObjectStore("photos", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("masters")) {
        db.createObjectStore("masters", { keyPath: "updatedAt" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(db: IDBDatabase, store: string, mode: IDBTransactionMode = "readwrite"): IDBObjectStore {
  return db.transaction([store], mode).objectStore(store);
}

/* 33 行付近: Unexpected any → 具体型に */
export async function putStore(store: Store): Promise<void> {
  const db = await openDB();
  await new Promise<void>((res, rej) => {
    const r = tx(db, "stores").put(store);
    r.onsuccess = () => res();
    r.onerror = () => rej(r.error);
  });
}

/* 40 行付近: Unexpected any → 返り値型を明示 */
export async function getStores(): Promise<Store[]> {
  const db = await openDB();
  return new Promise<Store[]>((res, rej) => {
    const r = tx(db, "stores", "readonly").getAll();
    r.onsuccess = () => res(r.result as Store[]);
    r.onerror = () => rej(r.error);
  });
}

/* deleteStore と関連削除 */
export async function deleteStore(storeId: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((res, rej) => {
    const r = tx(db, "stores").delete(storeId);
    r.onsuccess = () => res();
    r.onerror = () => rej(r.error);
  });
  await deleteByIndex<Entry>("entries", (e: Entry) => e.storeId === storeId);
  await deleteByIndex<Photo>("photos", (p: Photo) => p.storeId === storeId);
}

/* 54,55,58,64 行付近: ジェネリクスで any を排除 */
async function deleteByIndex<T extends { id: string }>(
  storeName: "entries" | "photos",
  pred: (obj: T) => boolean
): Promise<void> {
  const db = await openDB();
  await new Promise<void>((res, rej) => {
    const store = tx(db, storeName);
    const r = store.getAll();
    r.onsuccess = () => {
      const all = r.result as T[];
      const del = all.filter(pred);
      let pending = del.length;
      if (pending === 0) return res();
      del.forEach((obj: T) => {
        const d = store.delete(obj.id);
        d.onsuccess = () => { if (--pending === 0) res(); };
        d.onerror = () => rej(d.error);
      });
    };
    r.onerror = () => rej(r.error);
  });
}

/* 78 行付近: Entry 型を明示 */
export async function putEntry(entry: Entry): Promise<void> {
  const db = await openDB();
  await new Promise<void>((res, rej) => {
    const r = tx(db, "entries").put(entry);
    r.onsuccess = () => res();
    r.onerror = () => rej(r.error);
  });
}

/* 85 行付近: 戻り値型を明示 */
export async function getEntriesByStore(storeId: string): Promise<Entry[]> {
  const db = await openDB();
  return new Promise<Entry[]>((res, rej) => {
    const r = tx(db, "entries", "readonly").getAll();
    r.onsuccess = () => {
      const all = r.result as Entry[];
      res(all.filter((e: Entry) => e.storeId === storeId));
    };
    r.onerror = () => rej(r.error);
  });
}

/* 90 行付近: 返り値型を Entry | undefined に */
export async function getEntryByKey(storeId: string, key: string): Promise<Entry | undefined> {
  const all = await getEntriesByStore(storeId);
  return all.find((e: Entry) => `${e.machine}|${e.prize}|${e.size}|${e.setup}` === key);
}

/* 100 行付近: Photo 型を明示 */
export async function putPhoto(photo: Photo): Promise<void> {
  const db = await openDB();
  await new Promise<void>((res, rej) => {
    const r = tx(db, "photos").put(photo);
    r.onsuccess = () => res();
    r.onerror = () => rej(r.error);
  });
}

/* 追加：写真取得の返り値型も明示 */
export async function getPhotos(ids: string[]): Promise<Photo[]> {
  const db = await openDB();
  return new Promise<Photo[]>((res, rej) => {
    const store = tx(db, "photos", "readonly");
    const r = store.getAll();
    r.onsuccess = () => {
      const all = r.result as Photo[];
      res(all.filter((p: Photo) => ids.includes(p.id)));
    };
    r.onerror = () => rej(r.error);
  });
}

/* Masters も具体型で */
export async function putMasters(masters: Masters): Promise<void> {
  const db = await openDB();
  await new Promise<void>((res, rej) => {
    const r = tx(db, "masters").put(masters);
    r.onsuccess = () => res();
    r.onerror = () => rej(r.error);
  });
}

export async function getLatestMasters(): Promise<Masters | undefined> {
  const db = await openDB();
  return new Promise<Masters | undefined>((res, rej) => {
    const r = tx(db, "masters", "readonly").getAll();
    r.onsuccess = () => {
      const arr = r.result as Masters[];
      arr.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
      res(arr[0]);
    };
    r.onerror = () => rej(r.error);
  });
}
