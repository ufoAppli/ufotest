const DB_NAME = "mei-store-counter";
const DB_VER = 1;
export function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VER);
        req.onupgradeneeded = () => {
            const db = req.result;
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
function tx(db, store, mode = "readwrite") {
    return db.transaction([store], mode).objectStore(store);
}
/* 33 行付近: Unexpected any → 具体型に */
export async function putStore(store) {
    const db = await openDB();
    await new Promise((res, rej) => {
        const r = tx(db, "stores").put(store);
        r.onsuccess = () => res();
        r.onerror = () => rej(r.error);
    });
}
/* 40 行付近: Unexpected any → 返り値型を明示 */
export async function getStores() {
    const db = await openDB();
    return new Promise((res, rej) => {
        const r = tx(db, "stores", "readonly").getAll();
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
    });
}
/* deleteStore と関連削除 */
export async function deleteStore(storeId) {
    const db = await openDB();
    await new Promise((res, rej) => {
        const r = tx(db, "stores").delete(storeId);
        r.onsuccess = () => res();
        r.onerror = () => rej(r.error);
    });
    await deleteByIndex("entries", (e) => e.storeId === storeId);
    await deleteByIndex("photos", (p) => p.storeId === storeId);
}
/* 54,55,58,64 行付近: ジェネリクスで any を排除 */
async function deleteByIndex(storeName, pred) {
    const db = await openDB();
    await new Promise((res, rej) => {
        const store = tx(db, storeName);
        const r = store.getAll();
        r.onsuccess = () => {
            const all = r.result;
            const del = all.filter(pred);
            let pending = del.length;
            if (pending === 0)
                return res();
            del.forEach((obj) => {
                const d = store.delete(obj.id);
                d.onsuccess = () => { if (--pending === 0)
                    res(); };
                d.onerror = () => rej(d.error);
            });
        };
        r.onerror = () => rej(r.error);
    });
}
/* 78 行付近: Entry 型を明示 */
export async function putEntry(entry) {
    const db = await openDB();
    await new Promise((res, rej) => {
        const r = tx(db, "entries").put(entry);
        r.onsuccess = () => res();
        r.onerror = () => rej(r.error);
    });
}
/* 85 行付近: 戻り値型を明示 */
export async function getEntriesByStore(storeId) {
    const db = await openDB();
    return new Promise((res, rej) => {
        const r = tx(db, "entries", "readonly").getAll();
        r.onsuccess = () => {
            const all = r.result;
            res(all.filter((e) => e.storeId === storeId));
        };
        r.onerror = () => rej(r.error);
    });
}
/* 90 行付近: 返り値型を Entry | undefined に */
export async function getEntryByKey(storeId, key) {
    const all = await getEntriesByStore(storeId);
    return all.find((e) => `${e.machine}|${e.prize}|${e.size}|${e.setup}` === key);
}
/* 100 行付近: Photo 型を明示 */
export async function putPhoto(photo) {
    const db = await openDB();
    await new Promise((res, rej) => {
        const r = tx(db, "photos").put(photo);
        r.onsuccess = () => res();
        r.onerror = () => rej(r.error);
    });
}
/* 追加：写真取得の返り値型も明示 */
export async function getPhotos(ids) {
    const db = await openDB();
    return new Promise((res, rej) => {
        const store = tx(db, "photos", "readonly");
        const r = store.getAll();
        r.onsuccess = () => {
            const all = r.result;
            res(all.filter((p) => ids.includes(p.id)));
        };
        r.onerror = () => rej(r.error);
    });
}
/* Masters も具体型で */
export async function putMasters(masters) {
    const db = await openDB();
    await new Promise((res, rej) => {
        const r = tx(db, "masters").put(masters);
        r.onsuccess = () => res();
        r.onerror = () => rej(r.error);
    });
}
export async function getLatestMasters() {
    const db = await openDB();
    return new Promise((res, rej) => {
        const r = tx(db, "masters", "readonly").getAll();
        r.onsuccess = () => {
            const arr = r.result;
            arr.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
            res(arr[0]);
        };
        r.onerror = () => rej(r.error);
    });
}
