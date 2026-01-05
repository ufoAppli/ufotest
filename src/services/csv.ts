
// src/services/csv.ts
import type { Entry, Store } from "../types";  // ★ import type のままでOK

// ★ Excel互換のための設定
const BOM = "\uFEFF"; // UTF-8 BOM を先頭に付加
const NEWLINE = "\r\n"; // CRLF 改行（Windows版Excelとの相性◎）

function csvEscape(v: unknown): string {
  // 値を文字列化（null/undefined は空文字）
  const s: string =
    typeof v === "string" ? v :
    v === null || v === undefined ? "" :
    String(v);

  // CSVの仕様：カンマ・ダブルクォート・改行を含む場合はダブルクォートで囲む
  const needsQuote = /[",\r\n]/.test(s);
  const escaped = s.replace(/"/g, '""'); // 「"」は「""」にエスケープ
  return needsQuote ? `"${escaped}"` : escaped;
}

/**
 * 仕様に沿った店舗CSVを作成します。
 * - 文字コード：UTF-8+BOM
 * - 改行：CRLF（\r\n）
 * - クォート：必要時のみダブルクォート、内部の " は "" に
 * - 画像ファイル名：呼び出し側で fileName の配列を渡せる拡張点あり
 */
export function buildStoreCsv(
  store: Store,
  entries: Entry[],
  options?: {
    /** エントリID -> 写真ファイル名配列 のマップを渡せる（任意） */
    photoFileMap?: Record<string, string[]>;
  }
): string {
  const header = [
    "store_name",
    "machine",
    "prize",
    "size",
    "setup",
    "count",
    "photo_file_names",
    "created_at",
    "updated_at",
  ];

  const photoMap = options?.photoFileMap ?? {};

  const lines: string[] = [];
  // ヘッダ行
  lines.push(header.join(","));

  for (const e of entries) {
    const photoNames = (photoMap[e.id] ?? []).join("|"); // 仕様：複数は | 区切り（変更可）

    const row = [
      store.name,
      e.machine,
      e.prize,
      e.size,
      e.setup,
      e.count,
      photoNames,       // ★ 従来 "" だった列を実データに対応
      e.createdAt,
      e.updatedAt,
    ];

    lines.push(row.map(csvEscape).join(","));
  }

  // ★ BOM + CRLF で返す
  return BOM + lines.join(NEWLINE);
}

/**
 * CSVをダウンロードします。
 * - MIME: text/csv;charset=utf-8
 * - 拡張子: .csv を自動付与
 * - ObjectURL を解放
 */
export function download(filename: string, content: string): void {
  const name = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
