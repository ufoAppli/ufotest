import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
export default function StoreList() {
    const nav = useNavigate();
    const { stores, refreshStores } = useAppStore();
    useEffect(() => {
        refreshStores();
    }, [refreshStores]);
    const goStoreDetail = (storeId) => {
        nav(`/stores/${storeId}`); // 仕様：店舗タップでデータ表示へ
    };
    return (_jsx("div", { className: "page bg-light", children: _jsx("div", { className: "center-wrap", children: _jsxs("div", { className: "form-col", children: [_jsx("h2", { children: "\u5E97\u8217\u9078\u629E" }), stores.length === 0 && (_jsx("p", { style: { color: "#666" }, children: "\u5E97\u8217\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u30C8\u30C3\u30D7\u304B\u3089\u5E97\u8217\u3092\u4F5C\u6210\u3057\u3066\u304F\u3060\u3055\u3044\u3002" })), _jsxs("div", { className: "btn-col", children: [stores.map((s) => (_jsx("button", { className: "btn-md btn-block btn-blue", onClick: () => goStoreDetail(s.id), "aria-label": `${s.name} を選択`, children: s.name }, s.id))), _jsx("button", { className: "btn-md btn-block btn-glay3", onClick: () => nav("/"), "aria-label": "\u30C8\u30C3\u30D7\u3078\u623B\u308B", children: "\u623B\u308B" })] })] }) }) }));
}
