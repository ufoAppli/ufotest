// src/store/appStore.ts
import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { putStore, deleteStore, getStores, getEntriesByStore, putEntry, getEntryByKey, putPhoto } from "../db/indexedDb";
export const useAppStore = create((set, get) => ({
    masters: { machines: [], prizes: [], sizes: [], setups: [], updatedAt: new Date().toISOString() },
    stores: [],
    session: { tempPhotos: [] },
    currentStoreId: undefined,
    init: async (masters) => {
        set({ masters });
        const stores = await getStores();
        set({ stores });
    },
    createStore: async (name) => {
        const id = uuid();
        const now = new Date().toISOString();
        const store = { id, name, createdAt: now };
        await putStore(store);
        set({ currentStoreId: id, session: { ...get().session, storeId: id, storeName: name } });
        await get().refreshStores();
        return id;
    },
    deleteCurrentStore: async () => {
        const id = get().currentStoreId;
        if (!id)
            return;
        await deleteStore(id);
        set({ currentStoreId: undefined, session: { tempPhotos: [] } });
        await get().refreshStores();
    },
    setSession: (partial) => set({ session: { ...get().session, ...partial } }),
    // currentStep: 4/5/6/7 に応じて直前画面のデータを破棄
    clearPrevStepData: (currentStep) => {
        const s = { ...get().session };
        // 4で戻る: 3のデータ（店舗名/店舗ID）を破棄→店舗レコードも削除
        if (currentStep === 4) {
            get().deleteCurrentStore();
            s.storeId = undefined;
            s.storeName = undefined;
        }
        // 5で戻る: 機種破棄
        if (currentStep === 5) {
            s.machine = undefined;
        }
        // 6で戻る: プライズ破棄
        if (currentStep === 6) {
            s.prize = undefined;
        }
        // 7で戻る: 大きさ破棄
        if (currentStep === 7) {
            s.size = undefined;
        }
        set({ session: s });
    },
    upsertEntryWithPhotos: async () => {
        const { session, currentStoreId } = get();
        if (!currentStoreId || !session.machine || !session.prize || !session.size || !session.setup)
            return;
        const key = `${session.machine}|${session.prize}|${session.size}|${session.setup}`;
        const now = new Date().toISOString();
        let entry = await getEntryByKey(currentStoreId, key);
        if (entry) {
            entry.count += 1;
            entry.updatedAt = now;
            await putEntry(entry);
        }
        else {
            entry = {
                id: uuid(), storeId: currentStoreId,
                machine: session.machine, prize: session.prize, size: session.size, setup: session.setup,
                count: 1, photoIds: [], createdAt: now, updatedAt: now
            };
            await putEntry(entry);
        }
        // 一時写真を保存（ファイル名はタグ結合）→ entry.photoIds に格納
        for (const p of session.tempPhotos) {
            const pid = uuid();
            const photo = {
                id: pid, storeId: currentStoreId, entryId: entry.id,
                fileName: p.fileName, blob: p.blob, createdAt: now
            };
            await putPhoto(photo);
            entry.photoIds.push(pid);
        }
        // entry 更新（photoIds 反映）
        await putEntry(entry);
        // セッションの写真は消す（カウント単位でクリア）
        set({ session: { ...get().session, tempPhotos: [] } });
    },
    refreshStores: async () => {
        const stores = await getStores();
        set({ stores });
    },
    getEntriesForCurrentStore: async () => {
        const id = get().currentStoreId;
        if (!id)
            return [];
        return await getEntriesByStore(id);
    },
}));
