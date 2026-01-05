// src/services/masters.ts
import type { Masters } from "../types";  // ★ import type に変更

export async function fetchMasters(): Promise<Masters> {
  return {
    machines: ["2本爪 小型","2本爪 中型","3本爪 超小型","3本爪 小型","3本爪 中型","3本爪 大型","特殊","その他"],
    prizes: ["ぬい","フィギュア（箱）","食品（箱）","食品（非箱）","雑貨（箱）","雑貨（非箱）","その他"],
    sizes: ["小型10以下","中型10~20","大型20~30","超大型30以上","その他"],
    setups: ["橋渡し","山積み/ドカ盛","スライド/ハの字","フック/リング/S字","Cリング/Dリング","リング/ペラ輪","鳥よけ/剣山","平置き","その他"],
    updatedAt: new Date().toISOString()
  };
}