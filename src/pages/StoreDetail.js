import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppStore } from "../store/appStore";
import { getEntriesByStore, getPhotos } from "../db/indexedDb";
import { buildStoreCsv, download } from "../services/csv";
export default function StoreDetail() {
    const nav = useNavigate();
    const { id } = useParams();
    const { stores } = useAppStore();
    const store = stores.find((s) => s.id === id);
    const [entries, setEntries] = useState([]);
    const [photoMap, setPhotoMap] = useState({}); // entryId -> fileNames
    useEffect(() => {
        (async () => {
            if (!id)
                return;
            const e = await getEntriesByStore(id);
            setEntries(e);
            // 写真ファイル名の収集（UIで使用して TS6133 を回避）
            const map = {};
            for (const ent of e) {
                const photos = await getPhotos(ent.photoIds ?? []);
                map[ent.id] = photos.map((p) => p.fileName);
            }
            setPhotoMap(map);
        })();
    }, [id]);
    const byMachine = useMemo(() => groupBy(entries, (e) => e.machine), [entries]);
    const byPrize = useMemo(() => groupBy(entries, (e) => `${e.prize}-${e.size}`), [entries]);
    const bySetup = useMemo(() => groupBy(entries, (e) => e.setup), [entries]);
    const combos = useMemo(() => groupBy(entries, (e) => `${e.machine}-${e.prize}-${e.size}-${e.setup}`), [entries]);
    const onExportCsv = () => {
        if (!store)
            return;
        const csv = buildStoreCsv(store, entries);
        const fname = `store_${store.name}_${new Date().toISOString().slice(0, 10)}.csv`;
        download(fname, csv);
    };
    return (_jsx("div", { className: "page bg-light", children: _jsx("div", { className: "center-wrap", children: _jsxs("div", { className: "form-col", children: [_jsxs("div", { className: "data-section", children: [_jsxs("h2", { children: ["\u30C7\u30FC\u30BF\u8868\u793A\uFF1A", store?.name ?? "(不明)", " "] }), _jsxs("details", { open: true, children: [_jsx("summary", { children: "\u25BC\u6A5F\u7A2E" }), _jsx(ListGroup, { group: byMachine })] }), _jsxs("details", { children: [_jsx("summary", { children: "\u25BC\u30D7\u30E9\u30A4\u30BA" }), _jsx(ListGroup, { group: byPrize })] }), _jsxs("details", { children: [_jsx("summary", { children: "\u25BC\u4ED5\u639B\u3051" }), _jsx(ListGroup, { group: bySetup })] }), _jsxs("details", { children: [_jsx("summary", { children: "\u25BC\u7D44\u307F\u5408\u308F\u305B" }), _jsx(ListGroup, { group: combos })] })] }), _jsxs("details", { children: [_jsx("summary", { children: "\u25BC\u5199\u771F\u30D5\u30A1\u30A4\u30EB\u540D\u4E00\u89A7" }), _jsx("ul", { children: entries.map((e) => (_jsxs("li", { children: [`${e.machine}-${e.prize}-${e.size}-${e.setup}`, "\uFF1A", (photoMap[e.id] ?? []).join(" | ") || "(なし)"] }, e.id))) })] }), _jsxs("div", { className: "btn-col", style: { marginTop: 12 }, children: [_jsx("button", { className: "btn-sm btn-block btn-blue", onClick: () => nav("/stores"), "aria-label": "\u5E97\u8217\u4E00\u89A7\u306B\u623B\u308B", children: "OK" }), _jsx("button", { className: "btn-sm btn-block btn-orange2", onClick: () => nav("/delete", { state: { storeId: store?.id, storeName: store?.name } }), "aria-label": "\u5E97\u8217\u30C7\u30FC\u30BF\u3092\u524A\u9664", children: "\u30C7\u30FC\u30BF\u524A\u9664" }), _jsx("button", { className: "btn-sm btn-block btn-glay3", onClick: onExportCsv, "aria-label": "CSV\u3092\u51FA\u529B", children: "CSV\u51FA\u529B" })] })] }) }) }));
}
function groupBy(arr, keyFn) {
    return arr.reduce((acc, cur) => {
        const k = keyFn(cur);
        acc[k] = (acc[k] ?? 0) + cur.count;
        return acc;
    }, {});
}
function ListGroup({ group }) {
    return (_jsx("ul", { children: Object.entries(group).map(([k, v]) => (_jsxs("li", { children: [k, ": ", v] }, k))) }));
}
