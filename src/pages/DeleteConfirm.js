import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/DeleteConfirm.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
export default function DeleteConfirm() {
    const nav = useNavigate();
    const { state } = useLocation();
    const refreshStores = useAppStore((s) => s.refreshStores);
    const deleteCurrentStore = useAppStore((s) => s.deleteCurrentStore);
    const onYes = async () => {
        const id = state?.storeId;
        if (!id) {
            // 対象不明なら一覧へ
            nav("/stores");
            return;
        }
        try {
            // ★ 重要：対象店舗を一時的に currentStoreId としてセットしてから削除
            useAppStore.setState({ currentStoreId: id });
            await deleteCurrentStore();
            // 付随データのセッション整備（写真キューなど）
            const { setSession } = useAppStore.getState();
            setSession({ tempPhotos: [] });
            await refreshStores();
            nav("/stores");
        }
        catch (e) {
            console.error("店舗削除に失敗しました:", e);
            await refreshStores();
            nav("/stores");
        }
    };
    const onNo = () => {
        nav("/stores"); // 値を返さないので戻り値は void
    };
    return (_jsx("div", { className: "page bg-light", children: _jsx("div", { className: "center-wrap", children: _jsxs("div", { className: "form-col", children: [_jsx("h2", { children: "\u524A\u9664\u78BA\u8A8D" }), _jsxs("p", { style: { color: "#000", lineHeight: 1.6 }, children: ["\u672C\u5F53\u306B\u300C", state?.storeName ?? "選択した店舗", "\u300D\u306E\u5E97\u8217\u30C7\u30FC\u30BF\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F"] }), _jsxs("div", { className: "btn-col", children: [_jsx("button", { className: "btn-md btn-block btn-orange2", onClick: onYes, "aria-label": "\u306F\u3044\u3001\u524A\u9664\u3057\u307E\u3059", children: "\u306F\u3044" }), _jsx("button", { className: "btn-md btn-block btn-blue", onClick: onNo, "aria-label": "\u3044\u3044\u3048\u3001\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3059", children: "\u3044\u3044\u3048" })] }), _jsx("button", { className: "btn-md btn-block btn-glay3", onClick: () => nav("/stores"), "aria-label": "\u5E97\u8217\u4E00\u89A7\u3078\u623B\u308B", style: { marginTop: 12 }, children: "\u623B\u308B" })] }) }) }));
}
