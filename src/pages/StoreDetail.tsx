import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppStore } from "../store/appStore";
import type { Entry, Store } from "../types";
import { getEntriesByStore, getPhotos } from "../db/indexedDb";
import { buildStoreCsv, download } from "../services/csv";

export default function StoreDetail(): React.ReactElement {
  const nav = useNavigate();
  const { id } = useParams();
  const { stores } = useAppStore();
  const store: Store | undefined = stores.find((s: Store) => s.id === id);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [photoMap, setPhotoMap] = useState<Record<string, string[]>>({}); // entryId -> fileNames

  useEffect(() => {
    (async () => {
      if (!id) return;
      const e: Entry[] = await getEntriesByStore(id);
      setEntries(e);

      // 写真ファイル名の収集（UIで使用して TS6133 を回避）
      const map: Record<string, string[]> = {};
      for (const ent of e) {
        const photos = await getPhotos(ent.photoIds ?? []);
        map[ent.id] = photos.map((p) => p.fileName);
      }
      setPhotoMap(map);
    })();
  }, [id]);

  const byMachine: Record<string, number> = useMemo(
    () => groupBy(entries, (e: Entry) => e.machine),
    [entries]
  );
  const byPrize: Record<string, number> = useMemo(
    () => groupBy(entries, (e: Entry) => `${e.prize}-${e.size}`),
    [entries]
  );
  const bySetup: Record<string, number> = useMemo(
    () => groupBy(entries, (e: Entry) => e.setup),
    [entries]
  );
  const combos: Record<string, number> = useMemo(
    () => groupBy(entries, (e: Entry) => `${e.machine}-${e.prize}-${e.size}-${e.setup}`),
    [entries]
  );

  const onExportCsv = (): void => {
    if (!store) return;
    const csv: string = buildStoreCsv(store, entries);
    const fname: string = `store_${store.name}_${new Date().toISOString().slice(0, 10)}.csv`;
    download(fname, csv);
  };

  return (
    <div className="page bg-light">
      <div className="center-wrap">
        <div className="form-col">
          <div className="data-section">
            <h2>データ表示：{store?.name ?? "(不明)"} </h2>

            <details open>
              <summary>▼機種</summary>
              <ListGroup group={byMachine} />
            </details>

            <details>
              <summary>▼プライズ</summary>
              <ListGroup group={byPrize} />
            </details>

            <details>
              <summary>▼仕掛け</summary>
              <ListGroup group={bySetup} />
            </details>

            <details>
              <summary>▼組み合わせ</summary>
              <ListGroup group={combos} />
            </details>
          </div>

          {/* 写真ファイル名一覧（UI使用で変数を活かす） */}
          <details>
            <summary>▼写真ファイル名一覧</summary>
            <ul>
              {entries.map((e: Entry) => (
                <li key={e.id}>
                  {`${e.machine}-${e.prize}-${e.size}-${e.setup}`}：
                  {(photoMap[e.id] ?? []).join(" | ") || "(なし)"}
                </li>
              ))}
            </ul>
          </details>

          {/* ▼ ボタンは縦並び・フル幅・小さめ（btn-sm）に統一 */}
          <div className="btn-col" style={{ marginTop: 12 }}>
            {/* OK（一覧へ戻る） */}
            <button
              className="btn-sm btn-block btn-blue"
              onClick={() => nav("/stores")}
              aria-label="店舗一覧に戻る"
            >
              OK
            </button>

            {/* データ削除（削除確認へ：storeId と storeName を渡す） */}
            <button
              className="btn-sm btn-block btn-orange2"
              onClick={() =>
                nav("/delete", { state: { storeId: store?.id, storeName: store?.name } })
              }
              aria-label="店舗データを削除"
            >
              データ削除
            </button>

            {/* CSV出力 */}
            <button
              className="btn-sm btn-block btn-glay3"
              onClick={onExportCsv}
              aria-label="CSVを出力"
            >
              CSV出力
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function groupBy<T extends { count: number }>(
  arr: T[],
  keyFn: (t: T) => string
): Record<string, number> {
  return arr.reduce((acc: Record<string, number>, cur: T) => {
    const k: string = keyFn(cur);
    acc[k] = (acc[k] ?? 0) + cur.count;
    return acc;
  }, {} as Record<string, number>);
}

function ListGroup({ group }: { group: Record<string, number> }): React.ReactElement {
  return (
    <ul>
      {Object.entries(group).map(([k, v]: [string, number]) => (
        <li key={k}>
          {k}: {v}
        </li>
      ))}
    </ul>
  );
}
