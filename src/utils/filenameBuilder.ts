// src/utils/filenameBuilder.ts
export function buildPrizePhotoFilename(params: {
    storeName?: string;   // 先頭に付ける（必須推奨だがフォールバックあり）
    machine?: string;     // ConfirmEntry で使用
    prize?: string;
    size?: string;
    setup?: string;
    basenameOnly?: boolean; // StoreName画面で拡張子だけ付けたい等の用途
    ext?: "jpg" | "png";
}) {
    const {
        storeName,
        machine,
        prize,
        size,
        setup,
        basenameOnly = false,
        ext = "jpg",
    } = params;

    // ファイル名に使えない文字を除去（Windows/Android/一般ブラウザ対策）
    const safe = (s?: string) =>
    (s ?? "")
    .normalize("NFKC")
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

    const head = safe(storeName) || "店舗未設定";
    const tags = [safe(machine), safe(prize), safe(size), safe(setup)]
    .filter(Boolean)
    .join("-");

    // タイムスタンプ（YYYYMMDD-HHMMSS）
    const ts = new Date()
    .toISOString()
    .replace(/[:.]/g, "")
    .replace("T", "-")
    .slice(0, 15);

    // 先頭に店舗名を必ず付与
    const prefix = head;

    // 「店舗名のみ＋拡張子」の用途にも対応
    const base = basenameOnly
    ? prefix
    : [prefix, tags].filter(Boolean).join("_");

    return `${base}_${ts}.${ext}`;
}
