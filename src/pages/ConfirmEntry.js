import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/ConfirmEntry.tsx
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
import CameraButton from "../components/CameraButton";
import { buildPrizePhotoFilename } from "../utils/filenameBuilder";
export default function ConfirmEntry() {
    const nav = useNavigate();
    const { session, setSession, upsertEntryWithPhotos } = useAppStore();
    // 画面8仕様：4～7のタグ連結名で写真保存（先頭にタイムスタンプ）
    const makeFileName = () => {
        return buildPrizePhotoFilename({
            storeName: session.storeName, // ← 先頭に店舗名
            machine: session.machine ?? "",
            prize: session.prize ?? "",
            size: session.size ?? "",
            setup: session.setup ?? "",
            ext: "jpg",
        });
    };
    const onNextCount = async () => {
        await upsertEntryWithPhotos();
        // 次のカウントへ：画面4へ戻して再入力（4～7のタグをリセット）
        setSession({ machine: undefined, prize: undefined, size: undefined, setup: undefined });
        nav("/machine");
    };
    const onRetry = () => {
        // やり直し：4～7で保存したテキストデータを破棄して4へ
        setSession({
            machine: undefined,
            prize: undefined,
            size: undefined,
            setup: undefined,
            tempPhotos: [],
        });
        nav("/machine");
    };
    const onFinish = async () => {
        await upsertEntryWithPhotos();
        // トップへ
        setSession({ machine: undefined, prize: undefined, size: undefined, setup: undefined });
        nav("/");
    };
    return (_jsx("div", { className: "page bg-light", children: _jsx("div", { className: "center-wrap", children: _jsxs("div", { className: "form-col", children: [_jsx("h2", { children: "\u4F5C\u6210\u7D42\u4E86" }), _jsxs("p", { style: { color: "#333", lineHeight: 1.6 }, children: ["\u6A5F\u7A2E: ", session.machine ?? "-", " / \u30D7\u30E9\u30A4\u30BA: ", session.prize ?? "-", " / \u5927\u304D\u3055: ", session.size ?? "-", " / \u4ED5\u639B\u3051: ", session.setup ?? "-"] }), _jsx(CameraButton, { makeFileName: makeFileName, className: "btn-md btn-block btn-blue", label: "\u30AB\u30E1\u30E9\u8D77\u52D5" }), _jsx("button", { className: "btn-md btn-block btn-pink", onClick: onNextCount, "aria-label": "\u6B21\u306E\u30AB\u30A6\u30F3\u30C8\u3078", children: "\u6B21\u306E\u30AB\u30A6\u30F3\u30C8\u3078" }), _jsx("button", { className: "btn-md btn-block btn-glay3", onClick: onRetry, "aria-label": "\u3084\u308A\u76F4\u3057", children: "\u3084\u308A\u76F4\u3057" }), _jsx("button", { className: "btn-md btn-block btn-glay4", onClick: onFinish, "aria-label": "\u7D42\u4E86", children: "\u7D42\u4E86" })] }) }) }));
}
