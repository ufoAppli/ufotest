// src/pages/StoreName.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
import type { AppState } from "../store/appStore";
import type { Store } from "../types";
import CameraButton from "../components/CameraButton";
import { buildPrizePhotoFilename } from "../utils/filenameBuilder";

export default function StoreName(): React.ReactElement {
  const nav = useNavigate();
  const createStore = useAppStore((s: AppState) => s.createStore);
  const session     = useAppStore((s: AppState) => s.session);
  const [name, setName] = useState<string>(session.storeName ?? "");

  // 未入力時の自動採番（店舗1, 店舗2, ...）
  const autoName = (): string => {
    const stores = useAppStore.getState().stores;
    let i = 1;
    while (stores.find((s: Store) => s.name === `店舗${i}`)) i++;
    return `店舗${i}`;
  };

  const onOk = async (): Promise<void> => {
    const storeName: string = name.trim() || autoName();
    await createStore(storeName);
    nav("/machine");
  };

  // EnterキーでOK
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void onOk();
    }
  };

  return (
    <div className="page bg-default">
      <div className="center-wrap">
        <div className="form-col">
          <h2 style={{ color: '#000' }}>店舗名入力</h2>

          {/* フリー入力（上） */}
          <input
            className="input-text"
            style={{ color: "#000" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="店舗名を入力"
            aria-label="店舗名"
          />

          {/* OKボタン（任意の色：例はブルー） */}
          <button
            className="btn-md btn-block btn-pink"
            onClick={onOk}
          >
            OK
          </button>


          <CameraButton
            makeFileName={() => {
              // 入力中の値が空なら自動採番（画面の autoName() を使う）
              const storeNameForPhoto = (name.trim() || autoName());
              // この画面ではタグは未確定なので「店舗名のみ＋拡張子＋時刻」にする
              return buildPrizePhotoFilename({
                storeName: storeNameForPhoto,
                basenameOnly: true, // ← 店舗名のみで保存（この画面はラベルだけ）
                ext: "jpg",
              });
            }}
            className="btn-md btn-block btn-blue"
            label="カメラ起動"
          />

          <button
            className="btn-md btn-block btn-glay4"
            onClick={() => nav("/")}
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}
