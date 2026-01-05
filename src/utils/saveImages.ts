// src/utils/saveImage.ts
export function saveImage(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);

  // aタグでダウンロードをトリガー
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);

  // ユーザー操作直後に呼び出されると iOS Safari でも成功率が高い
    a.click();

  // 後始末
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}