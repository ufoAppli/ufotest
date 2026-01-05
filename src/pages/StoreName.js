import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/StoreName.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
import CameraButton from "../components/CameraButton";
import { buildPrizePhotoFilename } from "../utils/filenameBuilder";
export default function StoreName() {
    const nav = useNavigate();
    const createStore = useAppStore((s) => s.createStore);
    const session = useAppStore((s) => s.session);
    const [name, setName] = useState(session.storeName ?? "");
    // 未入力時の自動採番（店舗1, 店舗2, ...）
    const autoName = () => {
        const stores = useAppStore.getState().stores;
        let i = 1;
        while (stores.find((s) => s.name === `店舗${i}`))
            i++;
        return `店舗${i}`;
    };
    const onOk = async () => {
        const storeName = name.trim() || autoName();
        await createStore(storeName);
        nav("/machine");
    };
    // EnterキーでOK
    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            void onOk();
        }
    };
    return (_jsx("div", { className: "page bg-default", children: _jsx("div", { className: "center-wrap", children: _jsxs("div", { className: "form-col", children: [_jsx("h2", { style: { color: '#000' }, children: "\u5E97\u8217\u540D\u5165\u529B" }), _jsx("input", { className: "input-text", style: { color: "#000" }, value: name, onChange: (e) => setName(e.target.value), onKeyDown: onKeyDown, placeholder: "\u5E97\u8217\u540D\u3092\u5165\u529B", "aria-label": "\u5E97\u8217\u540D" }), _jsx("button", { className: "btn-md btn-block btn-pink", onClick: onOk, children: "OK" }), _jsx(CameraButton, { makeFileName: () => {
                            // 入力中の値が空なら自動採番（画面の autoName() を使う）
                            const storeNameForPhoto = (name.trim() || autoName());
                            // この画面ではタグは未確定なので「店舗名のみ＋拡張子＋時刻」にする
                            return buildPrizePhotoFilename({
                                storeName: storeNameForPhoto,
                                basenameOnly: true, // ← 店舗名のみで保存（この画面はラベルだけ）
                                ext: "jpg",
                            });
                        }, className: "btn-md btn-block btn-blue", label: "\u30AB\u30E1\u30E9\u8D77\u52D5" }), _jsx("button", { className: "btn-md btn-block btn-glay4", onClick: () => nav("/"), children: "\u623B\u308B" })] }) }) }));
}
