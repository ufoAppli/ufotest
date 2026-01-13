// src/pages/ConfirmEntry.tsx
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
import CameraButton from "../components/CameraButton";
import { buildPrizePhotoFilename } from "../utils/filenameBuilder";
import { useState } from "react";

export default function ConfirmEntry() {
  console.log(">>> render ConfirmEntry.tsx", new Date().toISOString());
  
  const nav = useNavigate();
  const { session, setSession, upsertEntryWithPhotos } = useAppStore();
  
  // ローディング状態（連打防止）
  const [saving, setSaving] = useState(false);

  // 画面8仕様：4～7のタグ連結名で写真保存（先頭にタイムスタンプ）
  const makeFileName = () => {
    return buildPrizePhotoFilename({
      storeName: session.storeName,  // ← 先頭に店舗名
      machine:   session.machine ?? "",
      prize:     session.prize   ?? "",
      size:      session.size    ?? "",
      setup:     session.setup   ?? "",
      ext:       "jpg",
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

  const onSameCount = async () => {
    if (!session.machine || !session.prize || !session.size || !session.setup) return;
    try {
      setSaving(true);
      await upsertEntryWithPhotos();
      // ページ遷移なし／セッション変更なし
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page bg-light">
      <div className="center-wrap">
        <div className="form-col">
          <h2>作成終了</h2>

          {/* まとめ表示（現在の選択内容） */}
          <p style={{ color: "#333", lineHeight: 1.6 }}>
            機種: {session.machine ?? "-"} / プライズ: {session.prize ?? "-"} / 大きさ: {session.size ?? "-"} / 仕掛け: {session.setup ?? "-"}
          </p>

          {/* 画面8準拠：カメラボタン（先頭に配置、フル幅） */}
          <CameraButton
            makeFileName={makeFileName}
            className="btn-md btn-block btn-blue"
            label="カメラ起動"
          />

          {/* 次のカウントへ */}
          <button
            className="btn-md btn-block btn-pink"
            onClick={onNextCount}
            aria-label="次のカウントへ"
          >
            次のカウントへ
          </button>

          {/* 同じ内容でカウント */}
          <button
            className="btn-md btn-block btn-green2"
            onClick={onSameCount}
            disabled={!session.machine || !session.prize || !session.size || !session.setup || saving}
            aria-label="同じ内容でカウント"
          >
            {saving ? "更新中…" : "同じ内容でカウント"}
          </button>

          {/* やり直し（オレンジ） */}
          <button
            className="btn-md btn-block btn-glay3"
            onClick={onRetry}
            aria-label="やり直し"
          >
            やり直し
          </button>

          {/* 終了（グレー） */}
          <button
            className="btn-md btn-block btn-glay4"
            onClick={onFinish}
            aria-label="終了"
          >
            終了
          </button>
        </div>
      </div>
    </div>
  );
}
