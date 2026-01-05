// src/pages/DeleteConfirm.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
import type { AppState } from "../store/appStore";

export default function DeleteConfirm(): React.ReactElement {
  const nav = useNavigate();
  const { state } = useLocation() as { state?: { storeId?: string; storeName?: string } };

  const refreshStores      = useAppStore((s: AppState) => s.refreshStores);
  const deleteCurrentStore = useAppStore((s: AppState) => s.deleteCurrentStore);

  const onYes = async (): Promise<void> => {
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
    } catch (e) {
      console.error("店舗削除に失敗しました:", e);
      await refreshStores();
      nav("/stores");
    }
  };
  
  const onNo = (): void => {
    nav("/stores"); // 値を返さないので戻り値は void
  };

  return (
    <div className="page bg-light">
      <div className="center-wrap">
        <div className="form-col">
          <h2>削除確認</h2>
          <p style={{ color: "#000", lineHeight: 1.6 }}>
            本当に「{state?.storeName ?? "選択した店舗"}」の店舗データを削除しますか？
          </p>

          <div className="btn-col">
            <button
              className="btn-md btn-block btn-orange2"
              onClick={onYes}
              aria-label="はい、削除します"
            >
              はい
            </button>
            <button
              className="btn-md btn-block btn-blue"
              onClick={onNo}
              aria-label="いいえ、キャンセルします"
            >
              いいえ
            </button>
          </div>

          <button
            className="btn-md btn-block btn-glay3"
            onClick={() => nav("/stores")}
            aria-label="店舗一覧へ戻る"
            style={{ marginTop: 12 }}
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}