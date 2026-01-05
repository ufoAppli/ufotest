import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
import type { Store } from "../types";

export default function StoreList(): React.ReactElement {
  const nav = useNavigate();
  const { stores, refreshStores } = useAppStore();

  useEffect(() => {
    refreshStores();
  }, [refreshStores]);

  const goStoreDetail = (storeId: string) => {
    nav(`/stores/${storeId}`); // 仕様：店舗タップでデータ表示へ
  };

  return (
    <div className="page bg-light">
      <div className="center-wrap">
        <div className="form-col">
          <h2>店舗選択</h2>

          {/* 店舗がない場合の案内 */}
          {stores.length === 0 && (
            <p style={{ color: "#666" }}>
              店舗データがありません。トップから店舗を作成してください。
            </p>
          )}

          {/* ボタン縦並び（フル幅） */}
          <div className="btn-col">
            {stores.map((s: Store) => (
              <button
                key={s.id}
                className="btn-md btn-block btn-blue"
                onClick={() => goStoreDetail(s.id)}
                aria-label={`${s.name} を選択`}
              >
                {s.name}
              </button>
            ))}

            {/* 戻る（トップへ） */}
            <button
              className="btn-md btn-block btn-glay3"
              onClick={() => nav("/")}
              aria-label="トップへ戻る"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

