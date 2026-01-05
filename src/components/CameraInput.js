import { jsx as _jsx } from "react/jsx-runtime";
// src/components/CameraInput.tsx
import { forwardRef } from "react";
import { useAppStore } from "../store/appStore";
import { saveImage } from "../utils/saveImages";
const CameraInput = forwardRef(function CameraInput({ makeFileName, hidden = true, onSelected }, ref) {
    const setSession = useAppStore((s) => s.setSession);
    const onPick = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        // ファイル名（仕様のタグ結合ロジックから生成）
        const fileName = makeFileName();
        // そのまま端末へ保存（BlobはFileでも問題なし）
        saveImage(file, fileName);
        // 既存の一時保存ロジックは維持
        const ab = await file.arrayBuffer();
        const blob = new Blob([ab], { type: file.type });
        setSession({
            tempPhotos: [
                ...useAppStore.getState().session.tempPhotos,
                { fileName, blob }
            ]
        });
        // 連続撮影できるように input をリセット
        e.target.value = "";
        // 必要なら親へ通知
        onSelected?.(file);
    };
    return (_jsx("input", { ref: ref, type: "file", accept: "image/*", capture: "environment", onChange: onPick, style: hidden ? { display: "none" } : undefined, "aria-label": "\u30AB\u30E1\u30E9\u5165\u529B" }));
});
export default CameraInput;
