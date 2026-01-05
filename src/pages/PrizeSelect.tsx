// src/pages/PrizeSelect.tsx
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";

export default function PrizeSelect() {
  const nav = useNavigate();
  const { masters, setSession, clearPrevStepData } = useAppStore();

  const onPick = (p: string): void => {
    setSession({ prize: p });
    nav("/size");
  };

  const onBack = (): void => { clearPrevStepData(5); nav(-1); };

  const colorByLabel: Record<string, string> = {
  "ぬい": "btn-green1",
  "フィギュア（箱）": "btn-green2",
  "食品（箱）": "btn-green3",
  "食品（非箱）": "btn-orange1",
  "雑貨（箱）": "btn-orange2",
  "雑貨（非箱）": "btn-orange3",
  "その他": "btn-glay4",
  };

  return (
    <div className="page bg-default">
      <div className="center-wrap">
        <div className="container" style={{ width: "100%" }}>
          <h2 style={{ marginBottom: 12, textAlign: "center", color: "#000" }}>プライズ種類選択</h2>

          {/* 3列＆正方形 */}
          <div className="grid-3">

            {masters.prizes.map((m: string) => {
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
