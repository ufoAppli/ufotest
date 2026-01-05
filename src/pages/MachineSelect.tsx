// src/pages/MachineSelect.tsx
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";

export default function MachineSelect() {
  const nav = useNavigate();
  const { masters, setSession, clearPrevStepData } = useAppStore();

  // ✅ 引数 s に string 型を明示
  const onPick = (s: string): void => {
    setSession({ machine: s });
    nav("/prize");
  };

  const onBack = (): void => {
    // 画面4 → 戻る → 画面3（店舗名破棄＆店舗自体も削除）
    clearPrevStepData(4);
    nav(-1);
  };

const colorByLabel: Record<string, string> = {
  "2本爪 中型": "btn-green1",
  "2本爪 小型": "btn-green2",
  "3本爪 超小型": "btn-orange1",
  "3本爪 小型": "btn-orange2",
  "3本爪 中型": "btn-orange3",
  "3本爪 大型": "btn-orange4",
  "特殊": "btn-glay3",
  "その他": "btn-glay4",
};

  return (
    <div className="page bg-default">
      <div className="center-wrap">
        <div className="container" style={{ width: "100%" }}>
          <h2 style={{ marginBottom: 12, textAlign: "center", color: "#000" }}>機種選択</h2>

          {/* 3列＆正方形 */}
          <div className="grid-3">

            {masters.machines.map((m: string) => {
              const colorClass = colorByLabel[m] ?? "btn-glay1"; // デフォルト
              return (
                <button
                  key={m}
                  className={`square-btn ${colorClass}`}
                  onClick={() => onPick(m)}
                  aria-label={m}
                >
                  {m}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="btn-md btn-block btn-glay3" onClick={onBack}>
              戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
