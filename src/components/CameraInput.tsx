// src/components/CameraInput.tsx
import { forwardRef } from "react";
import { useAppStore } from "../store/appStore";
import type { AppState } from "../store/appStore";
import { saveImage } from "../utils/saveImages";

type Props = {
  makeFileName: () => string;
  hidden?: boolean;
  onSelected?: (file?: File) => void; // ← 追加: コールバックを使いたい場合
};

const CameraInput = forwardRef<HTMLInputElement, Props>(function CameraInput(
  { makeFileName, hidden = true, onSelected },
  ref
) {
  const setSession = useAppStore((s: AppState) => s.setSession);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file: File | undefined = e.target.files?.[0];
    if (!file) return;

    // ファイル名（仕様のタグ結合ロジックから生成）
    const fileName: string = makeFileName();

    // そのまま端末へ保存（BlobはFileでも問題なし）
    saveImage(file, fileName);

    // 既存の一時保存ロジックは維持
    const ab: ArrayBuffer = await file.arrayBuffer();
    const blob: Blob = new Blob([ab], { type: file.type });

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

  return (
    <input
      ref={ref}
      type="file"
      accept="image/*"
      capture="environment"
      onChange={onPick}
      style={hidden ? { display: "none" } : undefined}
      aria-label="カメラ入力"
    />
  );
});

export default CameraInput;
